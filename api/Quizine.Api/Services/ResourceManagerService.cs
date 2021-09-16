using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Quizine.Api.Interfaces;
using System;
using System.Threading;
using System.Threading.Tasks;

namespace Quizine.Api.Services
{
    public class ResourceManagerService : BackgroundService
    {
        #region Private Members

        private readonly IResourceManagerParameters _parameters;
        private readonly ISessionRepository _sessionRepository;
        private readonly ILogger _logger;
        private Timer _timer;

        #endregion

        #region Constructor

        public ResourceManagerService(
            IResourceManagerParameters parameters, 
            ISessionRepository sessionRepository, 
            ILogger<ResourceManagerService> logger)
        {
            _logger = logger;
            _logger.LogTrace("Constructor");

            _parameters = parameters;
            _sessionRepository = sessionRepository;
        }

        #endregion

        #region Private Methods

        private void DisposeSessions(object state)
        {
            _logger.LogTrace("Evaluating sessions to dispose");
            int affected = _sessionRepository.DisposeSessions(_parameters.SessionLifetime);
            _logger.LogTrace($"Disposed {affected} sessions");
        }

        #endregion

        #region BackgroundService Implementation

        protected override Task ExecuteAsync(CancellationToken stoppingToken)
        {
            _logger.LogDebug("ResourceManagerService is starting");
            _logger.LogDebug($"Session lifetime: {_parameters.SessionLifetime}");
            _logger.LogDebug($"Poll interval: {_parameters.PollInterval}");

            _timer = new Timer(DisposeSessions, null, TimeSpan.Zero, _parameters.PollInterval);

            return Task.CompletedTask;
        }

        public override Task StopAsync(CancellationToken cancellationToken)
        {
            _logger.LogDebug("ResourceManagerService is stopping");

            _timer.Dispose();

            return base.StopAsync(cancellationToken);
        }

        #endregion
    }
}
