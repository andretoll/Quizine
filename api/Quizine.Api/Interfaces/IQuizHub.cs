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
        Task ConfirmStart(bool success);
        Task ValidateAnswer(ValidateAnswerDto dto);
        Task NextQuestion(NextQuestionDto dto);
        Task Results(ResultsDto dto);
        Task UserConnected(UserConnectedDto dto);
        Task QuizCompleted();
        Task ReportError(string message);

        // Race game mode
        Task NextQuestionIncoming(int delay);
        Task TriggerResults();

        // Rematch
        Task RematchPrompted(RematchDto dto);
    }
}
