using Quizine.Api.Models;
using System;

namespace Quizine.Api.Interfaces
{
    public interface ISessionRepository
    {
        #region Public Methods

        string GetFirstConnectionId(string sessionId);
        void AddUser(string sessionId, string connectionId, string username);
        bool UserExists(string sessionId, string username);

        void AddSession(SessionParameters sessionParameters);
        void StartSession(string sessionId);
        bool SessionExists(string sessionId);
        bool SessionFull(string sessionId);
        bool SessionStarted(string sessionId);
        QuizSession GetSessionBySessionId(string sessionId);
        QuizSession GetSessionByConnectionId(string connectionId);

        #endregion
    }
}
