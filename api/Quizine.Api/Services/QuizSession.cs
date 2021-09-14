﻿using Quizine.Api.Enums;
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
        public IEnumerable<QuizItem> Questions => _questions;
        public Ruleset Ruleset => _ruleset;
        public bool IsStarted => _isStarted;
        public bool IsCompleted => _memberProgressList.All(x => x.HasCompleted);
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

        public string RemoveUser(string connectionId)
        {
            var progress = _memberProgressList.Single(x => x.User.ConnectionID == connectionId);
            _memberProgressList.Remove(progress);

            return progress.User.Username;
        }

        public bool UserExists(string connectionId)
        {
            return _memberProgressList.Any(x => x.User.ConnectionID == connectionId);
        }

        public bool UsernameTaken(string username)
        {
            return _memberProgressList.Any(x => x.User.Username.ToLower() == username.ToLower());
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

        public string SubmitAnswer(string connectionId, string questionId, string answerId, out int points)
        {
            var progress = _memberProgressList.First(x => x.User.ConnectionID == connectionId);
            progress.AddResult(questionId, answerId);

            points = Ruleset.GetQuestionPoints(progress.QuizResults.Single(x => x.Question.ID == questionId));
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

        public bool IsAnswerSet(string connectionId, string questionId)
        {
            var progress = _memberProgressList.First(x => x.User.ConnectionID == connectionId);
            var question = progress.QuizResults.SingleOrDefault(x => x.Question.ID == questionId);

            return question.Answer != null && question.IsAnswerValid;
        }

        public bool IsFirstToAnswerCorrectly(string questionId)
        {
            foreach (var progress in _memberProgressList)
            {
                if (progress.QuizResults.Single(x => x.Question.ID == questionId).IsAnswerCorrect)
                    return false;
            }

            return true;
        }

        public bool AllUsersAnswered(string questionId)
        {
            return MemberProgressList.All(x => x.QuizResults.Single(y => y.Question.ID == questionId).IsAnswerValid);
        }

        #endregion
    }
}
