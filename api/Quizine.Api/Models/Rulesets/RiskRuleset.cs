using Quizine.Api.Models.Base;
using System.Collections.Generic;
using System.Linq;

namespace Quizine.Api.Models.Rulesets
{
    public class RiskRuleset : Ruleset
    {
        public override string Description => "High risk, high reward.";

        public override int CalculateMaxScore(IEnumerable<QuizItem> questions)
        {
            return questions.Count() * 1;
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
                if (result.Answer.IsAnswerValid())
                {
                    if (result.Answer.ID == result.Question.CorrectAnswer.ID)
                        score += 1;
                    else if (result.Answer != null)
                        score -= 1; 
                }
            }

            return score;
        }
    }
}
