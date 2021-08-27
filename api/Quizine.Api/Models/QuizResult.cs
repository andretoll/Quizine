using System;
using System.Collections.Generic;

namespace Quizine.Api.Models
{
    public class QuizResult
    {
        #region Public Properties

        public QuizItem Question { get; }
        public QuizAnswer Answer { get; private set; }

        #endregion

        #region Constructor

        public QuizResult(QuizItem quizItem)
        {
            Question = quizItem;
        }

        #endregion

        #region Public Methods

        public void SetAnswer(QuizAnswer answer)
        {
            if (Answer != null)
                throw new InvalidOperationException("Answer is already set.");

            Answer = answer ?? new QuizAnswer();
        }

        #endregion

        #region Public Static Methods

        public static IEnumerable<QuizResult> Parse(IEnumerable<QuizItem> quizItems)
        {
            List<QuizResult> quizResults = new();

            foreach (var quizItem in quizItems)
            {
                quizResults.Add(new QuizResult(quizItem));
            }

            return quizResults;
        }

        #endregion
    }
}
