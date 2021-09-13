using Quizine.Api.Models.Base;
using System.Collections.Generic;
using System.Linq;

namespace Quizine.Api.Models.Rulesets
{
    public class RiskRuleset : Ruleset
    {
        public override string Description => "Just like standard rules, but answering incorrectly will reduce your points. Is it worth the risk?";

        public override bool EnableSkip => true;

        public override string Title => "Risk";

        public override int CalculateMaxScore(IEnumerable<QuizItem> questions)
        {
            return questions.Count() * PointsFactor;
        }

        /// <summary>
        /// Correct answer: +1
        /// Incorrect answer: -1
        /// Skipped answer: +-0
        /// </summary>
        /// <param name="results"></param>
        /// <returns></returns>
        public override int CalculateScore(IEnumerable<QuizResult> results)
        {
            int score = 0;

            foreach (var result in results)
            {
                if (result.IsAnswerValid)
                {
                    if (result.IsAnswerCorrect)
                        score += PointsFactor;
                    else if (result.Answer != null)
                        score -= PointsFactor;

                    // Prevent negative score
                    if (score < 0)
                        score = 0;
                }
            }

            return score;
        }

        public override int GetQuestionPoints(QuizResult result)
        {
            int points = PointsFactor;

            if (result != null)
            {
                if (result != null && result.IsAnswerValid && result.IsAnswerCorrect)
                    return points;
                else if (result.IsAnswerValid)
                    return points * -1;
            }

            return 0;
        }
    }
}
