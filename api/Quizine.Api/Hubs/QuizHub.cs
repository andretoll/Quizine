using Microsoft.AspNetCore.SignalR;
using Quizine.Api.Dtos;
using Quizine.Api.Interfaces;
using Quizine.Api.Models;
using System;
using System.Threading.Tasks;

namespace Quizine.Api.Hubs
{
    public class QuizHub : Hub<IQuizHub>, IQuizApi
    {
        private readonly ISessionRepository _sessionRepository;

        public QuizHub(ISessionRepository sessionRepository)
        {
            _sessionRepository = sessionRepository;
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var session = _sessionRepository.GetSessionByConnectionId(Context.ConnectionId);

            if (session != null)
            {
                session.RemoveUser(Context.ConnectionId);
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, session.SessionParameters.SessionID);
                await Clients.Group(session.SessionParameters.SessionID).ConfirmDisconnect(new DisconnectConfirmationDto(session.GetUsers()));
            }

            await base.OnDisconnectedAsync(exception);
        }

        public async Task Connect(string sessionId, string username)
        {
            if (!_sessionRepository.SessionExists(sessionId))
            {
                await Clients.Caller.ConfirmConnect(ConnectConfirmationDto.CreateErrorResponse("Session does not exist."));
                return;
            }
            else if (_sessionRepository.SessionFull(sessionId))
            {
                await Clients.Caller.ConfirmConnect(ConnectConfirmationDto.CreateErrorResponse("Session is full."));
                return;
            }

            await AddConnection(sessionId, Context.ConnectionId, username);
            await Clients.Group(sessionId).ConfirmConnect(ConnectConfirmationDto.CreateSuccessResponse(_sessionRepository.GetSessionBySessionId(sessionId)));
        }

        private async Task AddConnection(string sessionId, string connectionId, string username)
        {
            _sessionRepository.GetSessionBySessionId(sessionId).AddUser(new User { ConnectionID = connectionId, Username = username });
            await Groups.AddToGroupAsync(Context.ConnectionId, sessionId);
        }
    }
}
