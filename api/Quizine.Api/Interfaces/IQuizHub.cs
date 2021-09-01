using Quizine.Api.Dtos;
using System.Threading.Tasks;

namespace Quizine.Api.Interfaces
{
    /// <summary>
    /// Contains functions to return events and data to clients.
    /// </summary>
    public interface IQuizHub
    {
        Task ConfirmConnect(ConnectConfirmationDto dto);
        Task ConfirmDisconnect(DisconnectConfirmationDto dto);
        Task ConfirmStart();
        Task ValidateAnswer(string correctAnswerId);
        Task NextQuestion(NextQuestionDto dto);
        Task Results(ResultsDto dto);
        Task UserConnected(UserConnectedDto dto);
        Task QuizCompleted();
    }
}
