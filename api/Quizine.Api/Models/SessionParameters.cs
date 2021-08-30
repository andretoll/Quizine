using Quizine.Api.Enums;
using System.ComponentModel.DataAnnotations;

namespace Quizine.Api.Models
{
    public class SessionParameters
    {
        #region Public Properties

        [Required]
        public Rule Rule { get; set; }

        [Required]
        public string Title { get; set; }

        [Required]
        [Range(1, 8, ErrorMessage = "The number of players must be in the range of 1-8.")]
        public int PlayerCount { get; set; }

        [Required]
        [Range(1, 50, ErrorMessage = "The number of questions must be in the range of 1-50.")]
        public int QuestionCount { get; set; }

        [Required]
        public int QuestionTimeout { get; set; }

        [Required]
        public int Category { get; set; }
        
        [Required]
        public string Difficulty { get; set; } 

        public string SessionID { get; set; }

        #endregion
    }
}
