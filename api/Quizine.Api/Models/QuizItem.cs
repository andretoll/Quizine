using System;
using System.Collections.Generic;
using System.Linq;

namespace Quizine.Api.Models
{
    public class QuizItem
    {
        #region Public Properties

        public string ID { get; }
        public string Category { get; }
        public string Difficulty { get; }
        public string Type { get; }
        public string Question { get; }
        public int QuestionIndex { get; }
        public QuizAnswer CorrectAnswer { get; }
        public IEnumerable<QuizAnswer> Answers { get; }

        #endregion

        #region Constructor

        public QuizItem(string category, string difficulty, string type, string question, int questionIndex, string correctAnswer, string[] incorrectAnswers)
        {
            ID = Guid.NewGuid().ToString();
            Category = category;
            Difficulty = difficulty;
            Type = type;
            Question = question;
            QuestionIndex = questionIndex;

            Random r = new();
            var answers = incorrectAnswers.Concat(new string[] { correctAnswer }).OrderBy(x => r.Next()).ToArray();
            Answers = QuizAnswer.Parse(answers);
            CorrectAnswer = Answers.First(x => x.Value == correctAnswer);
        } 

        #endregion
    }
}
