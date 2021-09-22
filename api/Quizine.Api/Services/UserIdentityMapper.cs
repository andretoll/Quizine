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
        }

        public void AddConnection(T userIdentity, string connectionId)
        {
            _logger.LogInformation($"Adding connection '{connectionId}' to user '{userIdentity}'");

            lock (_connections)
            {
                if (!_connections.TryGetValue(userIdentity, out HashSet<string> connections))
                {
                    connections = new HashSet<string>();
                    _connections.Add(userIdentity, connections);
                }

                lock (connections)
                {
                    connections.Add(connectionId);
                }
            }
        }

        public void RemoveConnection(T userIdentity, string connectionId)
        {
            _logger.LogInformation($"Removing connection '{connectionId}' from user '{userIdentity}'");

            lock (_connections)
            {
                if (!_connections.TryGetValue(userIdentity, out HashSet<string> connections))
                {
                    return;
                }

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

        public bool UserConnected(T userIdentity)
        {
            bool containsKey = _connections.ContainsKey(userIdentity);
            _logger.LogInformation($"User still connected: {containsKey}");

            return containsKey;
        }
    }
}