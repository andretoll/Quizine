using Quizine.Api.Enums;
using Quizine.Api.Interfaces;
using Quizine.Api.Models;
using System.Collections.Generic;
using System.Linq;

namespace Quizine.Api.Services
{
    public class SessionRepository : ISessionRepository
    {
        #region Private Members

        private readonly List<QuizSession> _quizSessions;

        #endregion

        #region Constructor

        public SessionRepository()
        {
            _quizSessions = new List<QuizSession>();
        }

        #endregion

        #region ISessionRepository Implementation

        public void AddSession(SessionParameters sessionParameters, IEnumerable<QuizItem> quizItems)
        {
            _quizSessions.Add(new QuizSession(sessionParameters, quizItems));
        }

        public QuizSession GetSessionBySessionId(string sessionId)
        {
            return _quizSessions.SingleOrDefault(x => x.SessionParameters.SessionID == sessionId);
        }

        public QuizSession GetSessionByConnectionId(string connectionId)
        {
            return _quizSessions.SingleOrDefault(x => x.GetUsers().Any(x => x.ConnectionID == connectionId));
        }

        public bool SessionExists(string sessionId)
        {
            return _quizSessions.Any(x => x.SessionParameters.SessionID == sessionId);
        }

        public bool SessionFull(string sessionId)
        {
            var quizSession = _quizSessions.Single(x => x.SessionParameters.SessionID == sessionId);
            return quizSession.GetUsers().Count() >= quizSession.SessionParameters.PlayerCount;
        }

        public bool SessionStarted(string sessionId)
        {
            var quizSession = _quizSessions.Single(x => x.SessionParameters.SessionID == sessionId);
            return quizSession.IsStarted;
        }

        public bool SessionCompleted(string sessionId)
        {
            var quizSession = _quizSessions.Single(x => x.SessionParameters.SessionID == sessionId);
            return quizSession.IsCompleted;
        }

        public void AddUser(string sessionId, string connectionId, string username)
        {
            var quizSession = _quizSessions.Single(x => x.SessionParameters.SessionID == sessionId);
            quizSession.AddUser(new User { ConnectionID = connectionId, Username = username });
        }

        public bool UserExists(string sessionId, string username)
        {
            var quizSession = _quizSessions.Single(x => x.SessionParameters.SessionID == sessionId);
            return quizSession.GetUsers().Any(x => x.Username == username);
        }

        public void StartSession(string sessionId)
        {
            var quizSession = _quizSessions.Single(x => x.SessionParameters.SessionID == sessionId);
            quizSession.Start();
        }

        public QuizItem GetNextQuestion(string sessionId, string connectionId, out bool lastQuestion)
        {
            var quizSession = _quizSessions.Single(x => x.SessionParameters.SessionID == sessionId);

            var nextQuestion = quizSession.GetNextQuestion(connectionId, out lastQuestion);
            return nextQuestion;
        }

        public string SubmitAnswer(string sessionId, string connectionId, string questionId, string answerId)
        {
            var quizSession = _quizSessions.Single(x => x.SessionParameters.SessionID == sessionId);
            return quizSession.SubmitAnswer(connectionId, questionId, answerId);
        }

        public IEnumerable<QuizProgress> GetResults(string sessionId)
        {
            var quizSession = _quizSessions.Single(x => x.SessionParameters.SessionID == sessionId);
            var rule = quizSession.SessionParameters.Rule;
            var results = quizSession.GetResults();
            return results;
        }

        public Rule GetSessionRule(string sessionId)
        {
            var quizSession = _quizSessions.Single(x => x.SessionParameters.SessionID == sessionId);
            return quizSession.SessionParameters.Rule;
        }

        #endregion
    }
}
