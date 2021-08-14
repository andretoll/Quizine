using Microsoft.AspNetCore.SignalR;
using Quizine.Api.Dtos;
using Quizine.Api.Interfaces;
using System;
using System.Threading.Tasks;

namespace Quizine.Api.Hubs
{
    public class QuizHub : Hub<IQuizHub>, IQuizApi
    {
        #region Private Members

        private readonly ISessionRepository _sessionRepository; 

        #endregion

        #region Constructor

        public QuizHub(ISessionRepository sessionRepository)
        {
            _sessionRepository = sessionRepository;
        }

        #endregion

        #region Overriden Methods

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

        #endregion

        #region Private Methods

        private async Task AddConnection(string sessionId, string connectionId, string username)
        {
            

            _sessionRepository.AddUser(sessionId, connectionId, username);
            await Groups.AddToGroupAsync(Context.ConnectionId, sessionId);
        }

        #endregion

        #region IQuizApi Implementation

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
            else if (_sessionRepository.SessionStarted(sessionId))
            {
                await Clients.Caller.ConfirmConnect(ConnectConfirmationDto.CreateErrorResponse("Session already started."));
                return;
            }
            else if (_sessionRepository.UserExists(sessionId, username))
            {
                await Clients.Caller.ConfirmConnect(ConnectConfirmationDto.CreateErrorResponse("A player with this username already joined."));
                return;
            }

            await AddConnection(sessionId, Context.ConnectionId, username);
            await Clients.Group(sessionId).ConfirmConnect(ConnectConfirmationDto.CreateSuccessResponse(_sessionRepository.GetSessionBySessionId(sessionId)));
        }

        public async Task Disconnect()
        {
            await OnDisconnectedAsync(null);
        }

        public async Task Start(string sessionId)
        {
            _sessionRepository.StartSession(sessionId);
            await Clients.Group(sessionId).ConfirmStart(true);
        }

        #endregion
    }
}
