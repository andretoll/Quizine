using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
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
        private readonly ILogger _logger;

        #endregion

        #region Constructor

        public QuizHub(ISessionRepository sessionRepository, ILogger<QuizHub> logger)
        {
            _logger = logger;
            _logger.LogTrace("Constructor");

            _sessionRepository = sessionRepository;
        }

        #endregion

        #region Overriden Methods

        public override Task OnConnectedAsync()
        {
            _logger.LogInformation($"Client connected: '{Context.ConnectionId}'");

            return base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            _logger.LogInformation($"Client disconnected: '{Context.ConnectionId}'");

            if (exception != null)
                _logger.LogError(exception, "Unexpected error occurred");

            var session = _sessionRepository.GetSessionByConnectionId(Context.ConnectionId);

            if (session != null)
            {
                // Remove user and return username
                _logger.LogDebug("Removing user...");
                string username = session.RemoveUser(Context.ConnectionId);
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, session.SessionParameters.SessionID);
                await Clients.Group(session.SessionParameters.SessionID).ConfirmDisconnect(new DisconnectConfirmationDto(session.GetUsers(), username));

                // Notify users if quiz is completed after disconnect
                if (session.IsCompleted)
                {
                    _logger.LogDebug("Quiz already completed. Notifying other users...");
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
            _logger.LogTrace($"({Context.ConnectionId}) Called '{nameof(Connect)}' endpoint");

            if (!_sessionRepository.SessionExists(sessionId))
            {
                _logger.LogDebug($"Session with ID '{sessionId}' does not exist");
                await Clients.Caller.ConfirmConnect(ConnectConfirmationDto.CreateErrorResponse("Session does not exist."));
                return;
            }
            else if (_sessionRepository.SessionFull(sessionId))
            {
                _logger.LogTrace($"Session with ID '{sessionId}' is full");
                await Clients.Caller.ConfirmConnect(ConnectConfirmationDto.CreateErrorResponse("Session is full."));
                return;
            }
            else if (_sessionRepository.SessionStarted(sessionId))
            {
                _logger.LogTrace($"Session with ID '{sessionId}' already started");
                await Clients.Caller.ConfirmConnect(ConnectConfirmationDto.CreateErrorResponse("Session already started."));
                return;
            }
            else if (_sessionRepository.GetSessionBySessionId(sessionId).UsernameTaken(username))
            {
                _logger.LogTrace($"Session with ID '{sessionId}' already contains user with username '{username}'");
                await Clients.Caller.ConfirmConnect(ConnectConfirmationDto.CreateErrorResponse($"Username '{username}' taken."));
                return;
            }

            await AddConnection(sessionId, Context.ConnectionId, username);
            await Clients.Group(sessionId).ConfirmConnect(ConnectConfirmationDto.CreateSuccessResponse(_sessionRepository.GetSessionBySessionId(sessionId)));
            await Clients.OthersInGroup(sessionId).UserConnected(new UserConnectedDto(username));
        }

        public async Task Disconnect()
        {
            _logger.LogTrace($"({Context.ConnectionId}) Called '{nameof(Disconnect)}' endpoint");

            await OnDisconnectedAsync(null);
        }

        public async Task Start(string sessionId)
        {
            _logger.LogTrace($"({Context.ConnectionId}) Called '{nameof(Start)}' endpoint");

            _sessionRepository.StartSession(sessionId);
            await Clients.Group(sessionId).ConfirmStart();
        }

        public async Task SubmitAnswer(string sessionId, string questionId, string answerId)
        {
            _logger.LogTrace($"({Context.ConnectionId}) Called '{nameof(SubmitAnswer)}' endpoint");

            var session = _sessionRepository.GetSessionBySessionId(sessionId);
            
            string correctAnswerId = session.SubmitAnswer(Context.ConnectionId, questionId, answerId);
            await Clients.Caller.ValidateAnswer(correctAnswerId);
        }

        public async Task NextQuestion(string sessionId)
        {
            _logger.LogTrace($"({Context.ConnectionId}) Called '{nameof(NextQuestion)}' endpoint");

            var session = _sessionRepository.GetSessionBySessionId(sessionId);

            var nextQuestion = session.GetNextQuestion(Context.ConnectionId, out bool lastQuestion);
            await Clients.Caller.NextQuestion(new NextQuestionDto(nextQuestion, lastQuestion));
        }

        public async Task GetResults(string sessionId)
        {
            _logger.LogTrace($"({Context.ConnectionId}) Called '{nameof(GetResults)}' endpoint");

            var session = _sessionRepository.GetSessionBySessionId(sessionId);

            var results = session.GetResults();
            
            await Clients.Group(sessionId).Results(new ResultsDto(results));

            // Notify users if quiz is completed
            if (_sessionRepository.SessionCompleted(sessionId))
            {
                _logger.LogDebug("Quiz completed. Notifying all users...");
                await Clients.Group(sessionId).QuizCompleted();
            }
        }

        #endregion
    }
}
