using Quizine.Api.Interfaces;
using System;

namespace Quizine.Api.Tests.Stubs
{
    public class ResourceManagerParametersStub : IResourceManagerParameters
    {
        public TimeSpan SessionLifetime { get; }
        public TimeSpan PollInterval { get; }

        public ResourceManagerParametersStub(TimeSpan sessionLifetime, TimeSpan pollInterval)
        {
            SessionLifetime = sessionLifetime;
            PollInterval = pollInterval;
        }
    }
}
