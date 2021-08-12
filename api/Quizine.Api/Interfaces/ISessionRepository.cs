using Quizine.Api.Models;

namespace Quizine.Api.Interfaces
{
    public interface ISessionRepository
    {
        void AddSession(SessionParameters sessionParameters);
        QuizSession GetSessionBySessionId(string sessionId);
        QuizSession GetSessionByConnectionId(string connectionId);
        bool SessionExists(string sessionId);
        bool SessionFull(string sessionId);
    }
}
