using Microsoft.Extensions.Logging;
using Quizine.Api.Interfaces;
using System.Collections.Generic;

namespace Quizine.Api.Services
{
    public class UserIdentityMapper<T> : IUserIdentityMapper<T>
    {
        private readonly Dictionary<T, HashSet<string>> _connections = new();
        private readonly ILogger _logger;

        public UserIdentityMapper(ILogger<UserIdentityMapper<string>> logger)
        {
            _logger = logger;
            _logger.LogTrace("Constructor");
        }

        /// <summary>
        /// Adds a connection ID to a user's connections.
        /// </summary>
        /// <param name="userIdentity"></param>
        /// <param name="connectionId"></param>
        public void AddConnection(T userIdentity, string connectionId)
        {
            _logger.LogDebug($"Adding connection '{connectionId}' to user '{userIdentity}'");

            lock (_connections)
            {
                // If user does not yet exist, create new set of connection IDs
                if (!_connections.TryGetValue(userIdentity, out HashSet<string> connections))
                {
                    connections = new HashSet<string>();
                    _connections.Add(userIdentity, connections);
                }

                // In any case, add new connection ID to set
                lock (connections)
                {
                    connections.Add(connectionId);
                }
            }
        }

        /// <summary>
        /// Removes a connection ID from a user's connections.
        /// </summary>
        /// <param name="userIdentity"></param>
        /// <param name="connectionId"></param>
        public void RemoveConnection(T userIdentity, string connectionId)
        {
            _logger.LogDebug($"Removing connection '{connectionId}' from user '{userIdentity}'");

            lock (_connections)
            {
                // If user does not exist, return
                if (!_connections.TryGetValue(userIdentity, out HashSet<string> connections))
                {
                    return;
                }

                // Otherwise, remove connection ID from set (and user if no connections left)
                lock (connections)
                {
                    connections.Remove(connectionId);

                    if (connections.Count == 0)
                    {
                        _connections.Remove(userIdentity);
                    }
                }
            }
        }

        /// <summary>
        /// Returns true if user has any connections.
        /// </summary>
        /// <param name="userIdentity"></param>
        /// <returns></returns>
        public bool UserConnected(T userIdentity)
        {
            bool containsKey = _connections.ContainsKey(userIdentity);
            _logger.LogDebug($"User still connected: {containsKey}");

            return containsKey;
        }
    }
}