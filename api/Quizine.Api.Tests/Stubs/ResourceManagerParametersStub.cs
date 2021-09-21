using Quizine.Api.Interfaces;
using System;

namespace Quizine.Api.Tests.Stubs
{
    public class ResourceManagerParametersStub : IResourceManagerParameters
    {
        public TimeSpan SessionLifetime { get; }
        public TimeSpan PollInterval { get; }

        public TimeSpan StartedSessionLifetime { get; }

        public ResourceManagerParametersStub(TimeSpan sessionLifetime, TimeSpan startedSessionLifetime, TimeSpan pollInterval)
        {
            SessionLifetime = sessionLifetime;
            StartedSessionLifetime = startedSessionLifetime;
            PollInterval = pollInterval;
        }
    }
}
