﻿using Microsoft.Extensions.Logging;
using Quizine.Api.Helpers;
using Quizine.Api.Interfaces;
using Quizine.Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Quizine.Api.Services
{
    public class SessionRepository : ISessionRepository
    {
        #region Private Members

        private readonly ICollection<QuizSession> _quizSessions;
        private readonly ILogger _logger;

        #endregion

        #region Constructor

        public SessionRepository(ILogger<SessionRepository> logger)
        {
            _logger = logger;
            _logger.LogTrace("Constructor");

            _quizSessions = new List<QuizSession>();
        }

        #endregion

        #region ISessionRepository Implementation

        public void AddSession(SessionParameters sessionParameters, IEnumerable<QuizItem> quizItems)
        {
            _logger.LogTrace($"{nameof(AddSession)}()");
            LogHelper.LogSessionParameters(_logger, sessionParameters, LogLevel.Debug);

            _quizSessions.Add(new QuizSession(sessionParameters, quizItems));
        }

        public IQuizSession GetSessionBySessionId(string sessionId)
        {
            _logger.LogTrace($"{nameof(GetSessionBySessionId)}()");

            return _quizSessions.SingleOrDefault(x => x.SessionParameters.SessionID == sessionId);
        }

        public IQuizSession GetSessionByUserId(string userId)
        {
            _logger.LogTrace($"{nameof(GetSessionByUserId)}()");

            return _quizSessions.SingleOrDefault(x => x.GetUsers().Any(x => x.UserID == userId));
        }

        public bool SessionExists(string sessionId)
        {
            _logger.LogTrace($"{nameof(SessionExists)}()");

            return _quizSessions.Any(x => x.SessionParameters.SessionID == sessionId);
        }

        public bool SessionFull(string sessionId)
        {
            _logger.LogTrace($"{nameof(SessionFull)}()");

            var quizSession = _quizSessions.Single(x => x.SessionParameters.SessionID == sessionId);
            return quizSession.GetUsers().Count() >= quizSession.SessionParameters.PlayerCount;
        }

        public bool SessionStarted(string sessionId)
        {
            _logger.LogTrace($"{nameof(SessionStarted)}()");

            var quizSession = _quizSessions.Single(x => x.SessionParameters.SessionID == sessionId);
            return quizSession.IsStarted;
        }

        public bool SessionCompleted(string sessionId)
        {
            _logger.LogTrace($"{nameof(SessionCompleted)}()");

            var quizSession = _quizSessions.Single(x => x.SessionParameters.SessionID == sessionId);
            return quizSession.IsCompleted;
        }

        public bool StartSession(string sessionId)
        {
            _logger.LogTrace($"{nameof(StartSession)}()");

            var quizSession = _quizSessions.SingleOrDefault(x => x.SessionParameters.SessionID == sessionId);

            if (quizSession == null)
            {
                _logger.LogWarning($"Failed to start session: Session with id '{sessionId}' does not exist.");
                return false;
            }

            quizSession.Start();
            return true;
        }

        public int DisposeSessions(TimeSpan lifetime, TimeSpan startedLifetime)
        {
            _logger.LogTrace($"{nameof(DisposeSessions)}()");

            if (!_quizSessions.Any())
                return 0;

            var sessions = _quizSessions.ToList();

            int affected = 0;
            for (int i = 0; i < _quizSessions.Count; i++)
            {
                bool shouldRemove = false;
                if (sessions[i].IsStarted)
                {
                    shouldRemove = sessions[i].Created.AddMinutes(startedLifetime.TotalMinutes) < DateTime.UtcNow;
                }
                else
                {
                    shouldRemove = sessions[i].Created.AddMinutes(lifetime.TotalMinutes) < DateTime.UtcNow;
                }

                if (shouldRemove)
                {
                    _quizSessions.Remove(sessions[i]);
                    affected++;
                }
            }

            return affected;
        }

        #endregion
    }
}
