using Quizine.Api.Models;
using System.Collections.Generic;

namespace Quizine.Api.Interfaces
{
    public interface IQuizSession
    {
        SessionParameters SessionParameters { get; }

        void AddUser(User name);
        void RemoveUser(string connectionId);
        IEnumerable<User> GetUsers();
    }
}
