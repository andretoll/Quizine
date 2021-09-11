namespace Quizine.Api.Dtos
{
    public class ValidateAnswerDto
    {
        #region Public Properties

        public string AnswerId { get; set; }
        public int Points { get; set; }

        #endregion

        #region Constructor

        public ValidateAnswerDto(string answerId, int points)
        {
            AnswerId = answerId;
            Points = points;
        }

        #endregion
    }
}
