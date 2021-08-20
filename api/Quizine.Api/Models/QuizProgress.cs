using Quizine.Api.Enums;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Quizine.Api.Models
{
    public class QuizProgress
    {
        #region Public Properties

        public User User { get; }
        public QuizItem NextQuestion { get; private set; }
        public List<QuizResult> QuizResults { get; }
        public bool IsLastQuestion => NextQuestion == QuizResults.Last().Question;
        public bool HasCompleted => NextQuestion == null;

        #endregion

        #region Constructor

        public QuizProgress(User user, IEnumerable<QuizItem> quizItems)
        {
            User = user;
            NextQuestion = quizItems.First();
            QuizResults = new List<QuizResult>(QuizResult.Parse(quizItems));
        }

        #endregion

        #region Public Methods

        public void AddResult(string questionId, string answerId)
        {
            var quizResult = QuizResults.First(x => x.Question.ID == questionId);
            quizResult.SetAnswer(quizResult.Question.Answers.FirstOrDefault(x => x.ID == answerId));

            var nextQuestionIndex = QuizResults.IndexOf(quizResult) + 1;

            if (nextQuestionIndex >= QuizResults.Count)
            {
                NextQuestion = null;
                return;
            }

            NextQuestion = QuizResults[nextQuestionIndex].Question;
        }

        public int CalculatePoints(Rule rule)
        {
            return rule switch
            {
                Rule.Standard => QuizResults.Where(x => x.Question.CorrectAnswer.ID == x.Answer.ID).Count() * 1,
                _ => throw new InvalidOperationException("Ruleset not supported."),
            };
        }

        #endregion
    }
}
