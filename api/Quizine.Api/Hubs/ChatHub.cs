using Microsoft.AspNetCore.SignalR;
using Quizine.Api.Hubs.Clients;
using Quizine.Api.Models;
using System.Threading.Tasks;

namespace Quizine.Api.Hubs
{
    public class ChatHub : Hub<IChatClient>
    {
        public async Task SendMessage(ChatMessage message)
        {
            await Clients.All.ReceiveMessage(message);
        }
    }
}
