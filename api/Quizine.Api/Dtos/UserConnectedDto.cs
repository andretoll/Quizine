using Quizine.Api.Interfaces;
using System.Linq;

namespace Quizine.Api.Dtos
{
    public class UserConnectedDto
    {
        public string Username { get; set; }
        public string[] Users { get; private set; }

        public UserConnectedDto(string username, IQuizSession session)
        {
            Username = username;
            Users = session.GetUsers().Select(x => x.Username).ToArray();
        }
    }
}
