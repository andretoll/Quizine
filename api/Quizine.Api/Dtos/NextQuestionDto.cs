using Quizine.Api.Models;
using System.Linq;

namespace Quizine.Api.Dtos
{
    public class NextQuestionDto
    {
        #region Public Properties

        public string ID { get; }
        public string Question { get; }
        public string Category { get; }
        public string Difficulty { get; }
        public QuizAnswer[] Answers { get; }
        public bool LastQuestion { get; }

        #endregion

        #region Constructor

        public NextQuestionDto(QuizItem quizItem, bool lastQuestion = false)
        {
            ID = quizItem.ID;
            Question = quizItem.Question;
            Category = quizItem.Category;
            Difficulty = quizItem.Difficulty;
            Answers = quizItem.Answers.ToArray();
            LastQuestion = lastQuestion;
        } 

        #endregion
    }
}
