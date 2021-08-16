using System;
using System.Collections.Generic;

namespace Quizine.Api.Models
{
    public class QuizAnswer
    {
        #region Public Properties

        public string ID { get; }
        public string Value { get; }

        #endregion

        #region Constructor

        public QuizAnswer(string value)
        {
            ID = Guid.NewGuid().ToString();
            Value = value;
        }

        #endregion

        #region Public Static Methods

        public static IEnumerable<QuizAnswer> Parse(string[] values)
        {
            List<QuizAnswer> answers = new();

            foreach (var value in values)
            {
                answers.Add(new QuizAnswer(value));
            }

            return answers;
        } 

        #endregion
    }
}
