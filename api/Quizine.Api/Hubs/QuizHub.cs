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
                string username = session.GetUser(Context.ConnectionId).Username;
                session.RemoveUser(Context.ConnectionId);
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, session.SessionParameters.SessionID);
                await Clients.Group(session.SessionParameters.SessionID).ConfirmDisconnect(new DisconnectConfirmationDto(session.GetUsers(), username));

                // Notify users if quiz is completed after disconnect
                if (session.IsCompleted)
                {
                    await Clients.Group(session.SessionParameters.SessionID).QuizCompleted();
                }
            }

            await base.OnDisconnectedAsync(exception);
        }

        #endregion

        #region Private Methods

        private async Task AddConnection(string sessionId, string connectionId, string username)
        {
            var session = _sessionRepository.GetSessionBySessionId(sessionId);

            session.AddUser(connectionId, username);
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

            await AddConnection(sessionId, Context.ConnectionId, username);
            await Clients.Group(sessionId).ConfirmConnect(ConnectConfirmationDto.CreateSuccessResponse(_sessionRepository.GetSessionBySessionId(sessionId)));
            await Clients.OthersInGroup(sessionId).UserConnected(new UserConnectedDto(username));
        }

        public async Task Disconnect()
        {
            await OnDisconnectedAsync(null);
        }

        public async Task Start(string sessionId)
        {
            _sessionRepository.StartSession(sessionId);
            await Clients.Group(sessionId).ConfirmStart();
        }

        public async Task SubmitAnswer(string sessionId, string questionId, string answerId)
        {
            var session = _sessionRepository.GetSessionBySessionId(sessionId);
            
            string correctAnswerId = session.SubmitAnswer(Context.ConnectionId, questionId, answerId);
            await Clients.Caller.ValidateAnswer(correctAnswerId);
        }

        public async Task NextQuestion(string sessionId)
        {
            var session = _sessionRepository.GetSessionBySessionId(sessionId);

            var nextQuestion = session.GetNextQuestion(Context.ConnectionId, out bool lastQuestion);
            await Clients.Caller.NextQuestion(new NextQuestionDto(nextQuestion, lastQuestion));
        }

        public async Task GetResults(string sessionId)
        {
            var session = _sessionRepository.GetSessionBySessionId(sessionId);

            var results = session.GetResults();
            
            await Clients.Group(sessionId).Results(new ResultsDto(results));

            // Notify users if quiz is completed
            if (_sessionRepository.SessionCompleted(sessionId))
            {
                await Clients.Group(sessionId).QuizCompleted();
            }
        }

        #endregion
    }
}
