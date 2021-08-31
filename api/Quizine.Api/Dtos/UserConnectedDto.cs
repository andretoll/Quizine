namespace Quizine.Api.Dtos
{
    public class UserConnectedDto
    {
        public string Username { get; set; }

        public UserConnectedDto(string username)
        {
            Username = username;
        }
    }
}
