using Quizine.Api.Interfaces;
using System;
using System.Collections.Generic;
using System.Timers;
namespace Quizine.Api.Models
{
    public class QuizSession : IQuizSession
    {
        #region Private Members

        private readonly List<User> _members;
        private bool _isStarted;

        #endregion

        #region Public Properties

        public SessionParameters SessionParameters { get; }
        public bool IsStarted => _isStarted;

        #endregion

        #region Contructor

        public QuizSession(SessionParameters sessionParameters)
        {
            SessionParameters = sessionParameters;
            _members = new List<User>();
        }

        #endregion

        #region IQuizSession Implementation

        public void AddUser(User user)
        {
            _members.Add(user);
        }

        public IEnumerable<User> GetUsers()
        {
            return _members;
        }

        public void RemoveUser(string connectionId)
        {
            _members.RemoveAll(x => x.ConnectionID == connectionId);
        }

        public void Start()
        {
            if (_isStarted)
                throw new InvalidOperationException("Quiz session already started.");

            _isStarted = true;
        }

        #endregion
    }
}
