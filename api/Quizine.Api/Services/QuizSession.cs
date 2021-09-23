using Quizine.Api.Enums;
using Quizine.Api.Helpers;
using Quizine.Api.Interfaces;
using Quizine.Api.Models;
using Quizine.Api.Models.Base;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Quizine.Api.Services
{
    public class QuizSession : IQuizSession
    {
        #region Private Members

        private readonly DateTime _created;
        private readonly Ruleset _ruleset;
        private readonly List<QuizItem> _questions;
        private readonly List<QuizProgress> _memberProgressList;
        private readonly int _maxScore;
        private bool _isStarted;

        #endregion

        #region Public Properties

        public SessionParameters SessionParameters { get; }
        public IEnumerable<QuizProgress> MemberProgressList => _memberProgressList;
        public IEnumerable<QuizItem> Questions => _questions;
        public DateTime Created => _created;
        public Ruleset Ruleset => _ruleset;
        public bool IsStarted => _isStarted;
        public bool IsCompleted => _isStarted && _memberProgressList.All(x => x.HasCompleted || !x.Valid);
        public int QuestionCount => _questions.Count;
        public int MaxScore => _maxScore;

        #endregion

        #region Contructor

        public QuizSession(SessionParameters sessionParameters, IEnumerable<QuizItem> quizItems)
        {
            SessionParameters = sessionParameters;
            _created = DateTime.UtcNow;
            _ruleset = Ruleset.Parse(sessionParameters.Rule);
            _memberProgressList = new List<QuizProgress>();
            _questions = new List<QuizItem>(quizItems);
            _maxScore = _ruleset.CalculateMaxScore(quizItems);
        }

        #endregion

        #region IQuizSession Implementation

        public void AddUser(string userId, string username)
        {
            if (_isStarted)
                throw new InvalidOperationException("Session has already started.");

            var user = new User { UserID = userId, Username = username };
            _memberProgressList.Add(new QuizProgress(user, _questions));
        }

        public IEnumerable<User> GetUsers()
        {
            return _memberProgressList.Select(x => x.User).ToList();
        }

        public User GetUser(string userId)
        {
            return _memberProgressList.Select(x => x.User).FirstOrDefault(x => x.UserID == userId);
        }

        public string RemoveUser(string userId)
        {
            var progress = _memberProgressList.SingleOrDefault(x => x.User.UserID == userId);

            if (progress == null)
                return null;

            progress.Invalidate();

            return progress.User.Username;
        }

        public bool UserExists(string userId)
        {
            return _memberProgressList.Any(x => x.User.UserID == userId);
        }

        public bool UsernameTaken(string username)
        {
            return _memberProgressList.Any(x => x.User.Username.ToLower() == username.ToLower());
        }

        public bool UserCompleted(string userId)
        {
            return _memberProgressList.Single(x => x.User.UserID == userId).HasCompleted;
        }

        public void Start()
        {
            if (_isStarted)
                throw new InvalidOperationException("Quiz session already started.");

            if (_questions == null || !_questions.Any())
                throw new InvalidOperationException("Quiz session does not have any questions.");

            _isStarted = true;
        }

        public QuizItem GetNextUserQuestion(string userId, out bool lastQuestion)
        {
            var progress = _memberProgressList.Single(x => x.User.UserID == userId);
            lastQuestion = progress.IsLastQuestion;

            return progress.NextQuestion;
        }

        public QuizItem GetNextSessionQuestion(string previousQuestionId, out bool lastQuestion)
        {
            QuizItem nextQuestion;

            if (string.IsNullOrEmpty(previousQuestionId))
            {
                nextQuestion = _questions.First();
            }
            else
            {
                int index = _questions.IndexOf(_questions.Single(x => x.ID == previousQuestionId));

                if (index + 1 >= _questions.Count)
                {
                    lastQuestion = true;
                    return null;
                }

                nextQuestion = _questions[index + 1];

            }

            lastQuestion = nextQuestion == _questions.Last();

            return nextQuestion;
        }

        public string SubmitAnswer(string userId, string questionId, string answerId, out int points)
        {
            var progress = _memberProgressList.Single(x => x.User.UserID == userId);
            progress.AddResult(questionId, answerId);

            points = Ruleset.GetQuestionPoints(progress.QuizResults.Single(x => x.Question.ID == questionId));
            return _questions.Single(x => x.ID == questionId).CorrectAnswer.ID;
        }

        public IEnumerable<QuizProgress> GetResults()
        {
            var progressList = _memberProgressList.Where(x => x.HasCompleted);

            foreach (var progress in progressList)
            {
                if (progress.Score != null)
                    continue;

                progress.CalculateScore(_ruleset);
            }

            return ScoreSorter.Sort(progressList, ScoreSortType.ScoreDescending);
        }

        public bool IsAnswerSet(string userId, string questionId)
        {
            var progress = _memberProgressList.Single(x => x.User.UserID == userId);
            var question = progress.QuizResults.SingleOrDefault(x => x.Question.ID == questionId);

            return question.Answer != null && question.IsAnswerValid;
        }

        //public bool IsFirstToAnswerCorrectly(string questionId)
        //{
        //    foreach (var progress in _memberProgressList)
        //    {
        //        if (progress.QuizResults.Single(x => x.Question.ID == questionId).IsAnswerCorrect)
        //            return false;
        //    }

        //    return true;
        //}

        public bool AllUsersAnswered(string questionId)
        {
            return MemberProgressList.Where(x => x.Valid).All(x => x.QuizResults.Single(y => y.Question.ID == questionId).IsAnswerValid);
        }

        #endregion
    }
}
