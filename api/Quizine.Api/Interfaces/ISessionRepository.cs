using Quizine.Api.Enums;
using Quizine.Api.Models;
using Quizine.Api.Services;
using System.Collections.Generic;

namespace Quizine.Api.Interfaces
{
    public interface ISessionRepository
    {
        #region Methods

        void AddUser(string sessionId, string connectionId, string username);
        bool UserExists(string sessionId, string username);

        void AddSession(SessionParameters sessionParameters, IEnumerable<QuizItem> quizItems);
        void StartSession(string sessionId);
        bool SessionExists(string sessionId);
        bool SessionFull(string sessionId);
        bool SessionStarted(string sessionId);
        QuizSession GetSessionBySessionId(string sessionId);
        QuizSession GetSessionByConnectionId(string connectionId);
        Rule GetSessionRule(string sessionId);

        QuizItem GetNextQuestion(string sessionId, string connectionId, out bool lastQuestion);
        string SubmitAnswer(string sessionId, string connectionId, string questionId, string answerId);
        IEnumerable<QuizProgress> GetResults(string sessionId, out bool sessionCompleted);

        #endregion
    }
}
