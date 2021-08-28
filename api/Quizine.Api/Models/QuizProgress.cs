using Quizine.Api.Models.Base;
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
        public int? Score { get; private set; }
        public DateTime? FinishedTime { get; private set; }

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
                FinishedTime = DateTime.Now;
                NextQuestion = null;
                return;
            }

            NextQuestion = QuizResults[nextQuestionIndex].Question;
        }

        public void CalculateScore(Ruleset ruleset)
        {
            if (Score != null)
                throw new InvalidOperationException("Error while calculating score: Score already set.");
            if (!HasCompleted)
                throw new InvalidOperationException("Error while calculating score: Quiz progress incomplete.");

            Score = ruleset.CalculateScore(QuizResults);
        }

        #endregion
    }
}
