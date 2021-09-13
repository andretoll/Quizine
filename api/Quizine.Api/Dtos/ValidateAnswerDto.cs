namespace Quizine.Api.Dtos
{
    public class ValidateAnswerDto
    {
        #region Public Properties

        public string AnswerId { get; set; }
        public int Points { get; set; }
        public string AnsweredBy { get; set; }

        #endregion

        #region Constructor

        public ValidateAnswerDto(string answerId, int points)
        {
            AnswerId = answerId;
            Points = points;
        }

        public ValidateAnswerDto(string answerId, int points, string answeredBy)
        {
            AnswerId = answerId;
            Points = points;
            AnsweredBy = answeredBy;
        }

        #endregion
    }
}
