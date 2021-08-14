using Quizine.Api.Interfaces;
using System.Linq;

namespace Quizine.Api.Dtos
{
    public class ConnectConfirmationDto
    {
        public bool Connected { get; set; }
        public int ExpectedUsers { get; set; }
        public string QuizTitle { get; set; }
        public string[] Users { get; set; }
        public string ErrorMessage { get; set; }

        public static ConnectConfirmationDto CreateErrorResponse(string errorMessage)
        {
            return new ConnectConfirmationDto { ErrorMessage = errorMessage };
        }

        public static ConnectConfirmationDto CreateSuccessResponse(IQuizSession session)
        {
            return new ConnectConfirmationDto 
            { 
                Connected = true, 
                QuizTitle = session.SessionParameters.Title, 
                ExpectedUsers = session.SessionParameters.PlayerCount,
                Users = session.GetUsers().Select(x => x.Username).ToArray() 
            };
        }
    }
}
