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

        public IQuizSession GetSessionBySessionId(string sessionId)
        {
            return _quizSessions.SingleOrDefault(x => x.SessionParameters.SessionID == sessionId);
        }

        public IQuizSession GetSessionByConnectionId(string connectionId)
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

        public void StartSession(string sessionId)
        {
            var quizSession = _quizSessions.Single(x => x.SessionParameters.SessionID == sessionId);
            quizSession.Start();
        }

        #endregion
    }
}
