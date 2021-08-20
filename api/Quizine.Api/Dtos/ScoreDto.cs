namespace Quizine.Api.Dtos
{
    public class ScoreDto
    {
        #region Public Properties

        public string Username { get; set; }
        public int Points { get; set; }

        #endregion

        #region Constructor

        public ScoreDto(string username, int points)
        {
            Username = username;
            Points = points;
        }

        #endregion
    }
}
