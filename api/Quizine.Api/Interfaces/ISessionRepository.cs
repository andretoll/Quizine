using Quizine.Api.Enums;
using Quizine.Api.Models;
using Quizine.Api.Services;
using System.Collections.Generic;

namespace Quizine.Api.Interfaces
{
    public interface ISessionRepository
    {
        #region Methods

        void AddSession(SessionParameters sessionParameters, IEnumerable<QuizItem> quizItems);
        void StartSession(string sessionId);
        bool SessionExists(string sessionId);
        bool SessionFull(string sessionId);
        bool SessionStarted(string sessionId);
        bool SessionCompleted(string sessionId);
        IQuizSession GetSessionBySessionId(string sessionId);
        IQuizSession GetSessionByConnectionId(string connectionId);

        #endregion
    }
}
