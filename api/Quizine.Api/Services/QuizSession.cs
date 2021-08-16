using Quizine.Api.Interfaces;
using Quizine.Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Quizine.Api.Services
{
    public class QuizSession : IQuizSession
    {
        #region Private Members

        private readonly List<QuizItem> _questions;
        private readonly List<User> _members;
        private readonly List<QuizProgress> _progress;
        private bool _isStarted;

        #endregion

        #region Public Properties

        public SessionParameters SessionParameters { get; }
        public bool IsStarted => _isStarted;

        #endregion

        #region Contructor

        public QuizSession(SessionParameters sessionParameters, IEnumerable<QuizItem> quizItems)
        {
            SessionParameters = sessionParameters;
            _members = new List<User>();
            _progress = new List<QuizProgress>();
            _questions = new List<QuizItem>(quizItems);
        }

        #endregion

        #region IQuizSession Implementation

        public void AddUser(User user)
        {
            _members.Add(user);
            _progress.Add(new QuizProgress(user, _questions));
        }

        public IEnumerable<User> GetUsers()
        {
            return _members;
        }

        public void RemoveUser(string connectionId)
        {
            _members.RemoveAll(x => x.ConnectionID == connectionId);
            _progress.RemoveAll(x => x.User.ConnectionID == connectionId);
        }

        public void Start()
        {
            if (_isStarted)
                throw new InvalidOperationException("Quiz session already started.");

            if (_questions == null || !_questions.Any())
                throw new InvalidOperationException("Quiz session does not have any questions.");

            _isStarted = true;
        }

        public QuizItem GetFirstQuestion()
        {
            return _questions.First();
        }

        public QuizItem GetNextQuestion(string connectionId, out bool lastQuestion)
        {
            var progress = _progress.First(x => x.User.ConnectionID == connectionId);
            lastQuestion = progress.IsLastQuestion;

            return progress.NextQuestion;
        }

        public string SubmitAnswer(string connectionId, string questionId, string answerId)
        {
            var progress = _progress.First(x => x.User.ConnectionID == connectionId);
            progress.AddResult(questionId, answerId);

            return _questions.First(x => x.ID == questionId).CorrectAnswer.ID;
        }

        #endregion
    }
}
