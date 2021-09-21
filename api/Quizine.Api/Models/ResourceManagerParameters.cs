using Quizine.Api.Interfaces;
using System;

namespace Quizine.Api.Models
{
    public class ResourceManagerParameters : IResourceManagerParameters
    {
        #region Private Members

        private const int SESSION_LIFETIME = 2;
        private const int STARTED_SESSION_LIFETIME = 1;
        private const int POLL_INTERVAL = 1;

        #endregion

        #region Public Properties

        public TimeSpan SessionLifetime => TimeSpan.FromMinutes(SESSION_LIFETIME);
        public TimeSpan StartedSessionLifetime => TimeSpan.FromMinutes(STARTED_SESSION_LIFETIME);
        public TimeSpan PollInterval => TimeSpan.FromMinutes(POLL_INTERVAL);

        #endregion
    }
}
