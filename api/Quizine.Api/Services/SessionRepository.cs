using Quizine.Api.Interfaces;
using Quizine.Api.Models;
using System.Collections.Generic;
using System.Linq;

namespace Quizine.Api.Services
{
    public class SessionRepository : ISessionRepository
    {
        private readonly List<QuizSession> _quizSessions;

        public SessionRepository()
        {
            _quizSessions = new List<QuizSession>();
        }

        public void AddSession(SessionParameters sessionParameters)
        {
            _quizSessions.Add(new QuizSession(sessionParameters));
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
    }
}
