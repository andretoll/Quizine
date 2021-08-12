using Quizine.Api.Models;
using System.Collections.Generic;
using System.Linq;

namespace Quizine.Api.Dtos
{
    public class DisconnectConfirmationDto
    {
        public string[] Users { get; set; }

        public DisconnectConfirmationDto(IEnumerable<User> users)
        {
            Users = users.Select(x => x.Username).ToArray();
        }
    }
}
