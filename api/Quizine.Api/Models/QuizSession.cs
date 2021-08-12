using Quizine.Api.Interfaces;
using System.Collections.Generic;
using System.Linq;

namespace Quizine.Api.Models
{
    public class QuizSession : IQuizSession
    {
        public SessionParameters SessionParameters { get; }
        private List<User> _members;

        public QuizSession(SessionParameters sessionParameters)
        {
            SessionParameters = sessionParameters;
            _members = new List<User>();
        }


        public void AddUser(User user)
        {
            _members.Add(user);
        }

        public IEnumerable<User> GetUsers()
        {
            return _members;
        }

        public void RemoveUser(string connectionId)
        {
            _members.RemoveAll(x => x.ConnectionID == connectionId);
        }
    }
}
