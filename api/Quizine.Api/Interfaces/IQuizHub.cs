using Quizine.Api.Dtos;
using System.Threading.Tasks;

namespace Quizine.Api.Interfaces
{
    /// <summary>
    /// Contains functions to return to clients.
    /// </summary>
    public interface IQuizHub
    {
        Task ConfirmConnect(ConnectConfirmationDto dto);
        Task ConfirmDisconnect(DisconnectConfirmationDto dto);
        Task ConfirmStart(bool success);
    }
}
