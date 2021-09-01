using Quizine.Api.Models;
using System.Collections.Generic;
using System.Linq;

namespace Quizine.Api.Dtos
{
    public class DisconnectConfirmationDto
    {
        #region Public Properties

        public string Username { get; set; }
        public string[] Users { get; }

        #endregion

        #region Constructor

        public DisconnectConfirmationDto(IEnumerable<User> users, string username)
        {
            Username = username;
            Users = users.Select(x => x.Username).ToArray();
        } 

        #endregion
    }
}
