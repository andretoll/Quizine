using Quizine.Api.Models;
using System.Threading.Tasks;

namespace Quizine.Api.Hubs.Clients
{
    public interface IChatClient
    {
        Task ReceiveMessage(ChatMessage message);
    }
}
