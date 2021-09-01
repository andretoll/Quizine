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

        private readonly Ruleset _ruleset;
        private readonly List<QuizItem> _questions;
        private readonly List<QuizProgress> _memberProgressList;
        private bool _isStarted;
        private readonly int _maxScore;

        #endregion

        #region Public Properties

        public SessionParameters SessionParameters { get; }
        public IEnumerable<QuizProgress> MemberProgressList => _memberProgressList;
        public Ruleset Ruleset => _ruleset;
        public bool IsStarted => _isStarted;
        public bool IsCompleted => _memberProgressList.Any() & _memberProgressList.All(x => x.HasCompleted);
        public int QuestionCount => _questions.Count;
        public int MaxScore => _maxScore;

        #endregion

        #region Contructor

        public QuizSession(SessionParameters sessionParameters, IEnumerable<QuizItem> quizItems)
        {
            SessionParameters = sessionParameters;
            _ruleset = Ruleset.Parse(sessionParameters.Rule);
            _memberProgressList = new List<QuizProgress>();
            _questions = new List<QuizItem>(quizItems);
            _maxScore = _ruleset.CalculateMaxScore(quizItems);
        }

        #endregion

        #region IQuizSession Implementation

        public void AddUser(string connectionId, string username)
        {
            var user = new User { ConnectionID = connectionId, Username = username };
            _memberProgressList.Add(new QuizProgress(user, _questions));
        }

        public IEnumerable<User> GetUsers()
        {
            return _memberProgressList.Select(x => x.User).ToList();
        }

        public User GetUser(string connectionId)
        {
            return _memberProgressList.Select(x => x.User).FirstOrDefault(x => x.ConnectionID == connectionId);
        }

        public void RemoveUser(string connectionId)
        {
            _memberProgressList.RemoveAll(x => x.User.ConnectionID == connectionId);
        }

        public bool UserExists(string connectionId)
        {
            return _memberProgressList.Any(x => x.User.ConnectionID == connectionId);
        }

        public void Start()
        {
            if (_isStarted)
                throw new InvalidOperationException("Quiz session already started.");

            if (_questions == null || !_questions.Any())
                throw new InvalidOperationException("Quiz session does not have any questions.");

            _isStarted = true;
        }

        public QuizItem GetNextQuestion(string connectionId, out bool lastQuestion)
        {
            var progress = _memberProgressList.First(x => x.User.ConnectionID == connectionId);
            lastQuestion = progress.IsLastQuestion;

            return progress.NextQuestion;
        }

        public string SubmitAnswer(string connectionId, string questionId, string answerId)
        {
            var progress = _memberProgressList.First(x => x.User.ConnectionID == connectionId);
            progress.AddResult(questionId, answerId);

            return _questions.First(x => x.ID == questionId).CorrectAnswer.ID;
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

        #endregion
    }
}
