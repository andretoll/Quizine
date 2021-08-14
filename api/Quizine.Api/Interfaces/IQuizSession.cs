using Quizine.Api.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Quizine.Api.Interfaces
{
    public interface IQuizSession
    {
        #region Properties

        SessionParameters SessionParameters { get; }
        bool IsStarted { get; }

        #endregion

        #region Methods

        void AddUser(User name);
        void RemoveUser(string connectionId);
        void Start();
        IEnumerable<User> GetUsers();
        
        #endregion
    }
}
