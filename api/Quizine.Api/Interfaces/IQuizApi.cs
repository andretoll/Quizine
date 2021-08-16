using System.Threading.Tasks;

namespace Quizine.Api.Interfaces
{
    /// <summary>
    /// Contains functions for clients to call.
    /// </summary>
    public interface IQuizApi
    {
        Task Connect(string sessionId, string username);
        Task Disconnect();
        Task Start(string sessionId);
        Task SubmitAnswer(string sessionId, string questionId, string answerId);
        Task NextQuestion(string sessionId);
    }
}
