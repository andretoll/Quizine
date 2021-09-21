using System;

namespace Quizine.Api.Interfaces
{
    public interface IResourceManagerParameters
    {
        /// <summary>
        /// Represents the lifetime of a session. After its lifetime, a session should be disposed.
        /// </summary>
        TimeSpan SessionLifetime { get; }

        /// <summary>
        /// Represents the lifetime of a session after it has been started. After its lifetime, a session should be disposed.
        /// </summary>
        TimeSpan StartedSessionLifetime { get; }

        /// <summary>
        /// Represents the interval in which the service evaluates if any sessions should be disposed.
        /// </summary>
        TimeSpan PollInterval { get; }
    }
}
