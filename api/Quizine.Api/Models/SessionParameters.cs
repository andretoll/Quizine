namespace Quizine.Api.Models
{
    public class SessionParameters
    {
        #region Public Properties

        public string SessionID { get; set; }
        public string Title { get; set; }
        public int PlayerCount { get; set; }
        public int QuestionCount { get; set; }
        public int Category { get; set; }
        public string Difficulty { get; set; } 

        #endregion
    }
}
