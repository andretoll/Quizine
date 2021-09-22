using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using Quizine.Api.Dtos;
using Quizine.Api.Enums;
using Quizine.Api.Interfaces;
using System;
using System.Threading.Tasks;

namespace Quizine.Api.Hubs
{
    public class QuizHub : Hub<IQuizHub>, IQuizApi
    {
        #region Private Members

        private const int USER_DISCONNECTED_TIMEOUT = 3000;

        private readonly ISessionRepository _sessionRepository;
        private readonly IUserIdentityMapper<string> _identityMapper;
        private readonly ILogger _logger;

        #endregion

        #region Constructor

        public QuizHub(ISessionRepository sessionRepository, IUserIdentityMapper<string> identityMapper, ILogger<QuizHub> logger)
        {
            _logger = logger;
            _logger.LogTrace("Constructor");

            _sessionRepository = sessionRepository;
            _identityMapper = identityMapper;
        }

        #endregion

        #region Overriden Methods

        public override Task OnConnectedAsync()
        {
            _logger.LogInformation($"Client connected: '{Context.UserIdentifier}' ({Context.ConnectionId})");

            // Add ConnectionID to mapper
            _identityMapper.AddConnection(Context.UserIdentifier, Context.ConnectionId);

            return base.OnConnectedAsync();
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            _logger.LogInformation($"Client disconnected: '{Context.UserIdentifier}' ({Context.ConnectionId})");

            if (exception != null)
                _logger.LogError(exception, "Unexpected error occurred");

            // Remove ConnectionID from mapper
            _identityMapper.RemoveConnection(Context.UserIdentifier, Context.ConnectionId);

            var session = _sessionRepository.GetSessionByUserId(Context.UserIdentifier);

            if (session != null)
            {
                // Remove user and return username
                _logger.LogDebug("Removing user...");
                await Groups.RemoveFromGroupAsync(Context.ConnectionId, session.SessionParameters.SessionID);

                if (await IsUserStillConnected(Context.UserIdentifier))
                {
                    _logger.LogDebug($"User {Context.UserIdentifier} is still connected. Aborting...");
                }
                else
                {
                    string username = session.RemoveUser(Context.UserIdentifier);
                    await Clients.Group(session.SessionParameters.SessionID).ConfirmDisconnect(new DisconnectConfirmationDto(session.GetUsers(), username));
                }

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

        private async Task AddNewUser(string sessionId)
        {
            var session = _sessionRepository.GetSessionBySessionId(sessionId);

            if (_sessionRepository.SessionFull(sessionId))
            {
                _logger.LogTrace($"Session with ID '{sessionId}' is full");
                await Clients.User(Context.UserIdentifier).ConfirmConnect(ConnectConfirmationDto.CreateErrorResponse("Session is full."));
                return;
            }
            else if (session.IsStarted)
            {
                _logger.LogTrace($"Session with ID '{sessionId}' already started");
                await Clients.User(Context.UserIdentifier).ConfirmConnect(ConnectConfirmationDto.CreateErrorResponse("Session already started."));
                return;
            }
            else if (session.UsernameTaken(Context.User.Identity.Name))
            {
                _logger.LogTrace($"Session with ID '{sessionId}' already contains user with username '{Context.User.Identity.Name}'");
                await Clients.User(Context.UserIdentifier).ConfirmConnect(ConnectConfirmationDto.CreateErrorResponse($"Username '{Context.User.Identity.Name}' taken."));
                return;
            }

            session.AddUser(Context.UserIdentifier, Context.User.Identity.Name);

            await Clients.User(Context.UserIdentifier).ConfirmConnect(ConnectConfirmationDto.CreateSuccessResponse(_sessionRepository.GetSessionBySessionId(sessionId)));
            await Clients.OthersInGroup(sessionId).UserConnected(new UserConnectedDto(Context.User.Identity.Name, _sessionRepository.GetSessionBySessionId(sessionId)));
        }

        private async Task AddExistingUser(string sessionId)
        {
            var session = _sessionRepository.GetSessionBySessionId(sessionId);

            if (session.IsStarted)
            {
                _logger.LogTrace($"Session with ID '{sessionId}' already started");

                if (session.UserCompleted(Context.UserIdentifier))
                {
                    await Clients.User(Context.UserIdentifier).ConfirmConnect(
                        ConnectConfirmationDto.CreateSuccessResponse(_sessionRepository.GetSessionBySessionId(sessionId))
                        .ForceState(PlayerState.Completed)
                    );
                }
                else
                {
                    await Clients.User(Context.UserIdentifier).ConfirmConnect(
                        ConnectConfirmationDto.CreateSuccessResponse(_sessionRepository.GetSessionBySessionId(sessionId))
                        .ForceState(PlayerState.InProgress)
                    );
                }
            }
            else
            {
                await Clients.User(Context.UserIdentifier).ConfirmConnect(
                        ConnectConfirmationDto.CreateSuccessResponse(_sessionRepository.GetSessionBySessionId(sessionId))
                        .ForceState(PlayerState.NotStarted)
                    );
            }
        }

        private async Task ReportErrorAsync(string message)
        {
            _logger.LogDebug($"Error reported: {message}");
            await Clients.User(Context.UserIdentifier).ReportError(message);
        }

        private async Task<bool> IsUserStillConnected(string userId)
        {
            await Task.Delay(USER_DISCONNECTED_TIMEOUT);

            return _identityMapper.UserConnected(userId);
        }

        #endregion

        #region IQuizApi Implementation

        public async Task Connect(string sessionId)
        {
            _logger.LogTrace($"({Context.ConnectionId}) Called '{nameof(Connect)}' endpoint");

            // Check if session exists
            if (!_sessionRepository.SessionExists(sessionId))
            {
                _logger.LogDebug($"Session with ID '{sessionId}' does not exist");
                await Clients.User(Context.UserIdentifier).ConfirmConnect(ConnectConfirmationDto.CreateErrorResponse("Session does not exist."));
                return;
            }

            var session = _sessionRepository.GetSessionBySessionId(sessionId);

            if (session.UserExists(Context.UserIdentifier))
            {
                // Add new user
                _logger.LogDebug("Existing user connected");
                await AddExistingUser(sessionId);
            }
            else
            {
                // Add existing user
                _logger.LogDebug("New user connected");
                await AddNewUser(sessionId);
            }

            await Groups.AddToGroupAsync(Context.ConnectionId, sessionId);
        }

        public async Task Disconnect()
        {
            _logger.LogTrace($"({Context.ConnectionId}) Called '{nameof(Disconnect)}' endpoint");

            await OnDisconnectedAsync(null);
        }

        public async Task Start(string sessionId)
        {
            _logger.LogTrace($"({Context.ConnectionId}) Called '{nameof(Start)}' endpoint");

            bool success = _sessionRepository.StartSession(sessionId);

            _logger.LogTrace($"Quiz started: {success}");

            if (success)
                await Clients.Group(sessionId).ConfirmStart(success);
            else
                await Clients.User(Context.UserIdentifier).ConfirmStart(success);
        }

        public async Task SubmitAnswer(string sessionId, string questionId, string answerId)
        {
            _logger.LogTrace($"({Context.ConnectionId}) Called '{nameof(SubmitAnswer)}' endpoint");

            var session = _sessionRepository.GetSessionBySessionId(sessionId);

            if (session == null)
                await ReportErrorAsync("Session expired.");
            else
                await session.Ruleset.SubmitAnswer(this, session, questionId, answerId);
        }

        public async Task NextQuestion(string sessionId)
        {
            _logger.LogTrace($"({Context.ConnectionId}) Called '{nameof(NextQuestion)}' endpoint");

            var session = _sessionRepository.GetSessionBySessionId(sessionId);

            if (session == null)
                await ReportErrorAsync("Session expired.");
            else
                await session.Ruleset.NextQuestion(this, session);
        }

        public async Task GetResults(string sessionId)
        {
            _logger.LogTrace($"({Context.ConnectionId}) Called '{nameof(GetResults)}' endpoint");

            var session = _sessionRepository.GetSessionBySessionId(sessionId);

            if (session == null)
                await ReportErrorAsync("Session expired.");
            else
                await session.Ruleset.GetResults(this, session);
        }

        #endregion
    }
}
