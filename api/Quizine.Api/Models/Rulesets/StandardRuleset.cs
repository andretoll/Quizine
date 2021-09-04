using Quizine.Api.Models.Base;
using System.Collections.Generic;
using System.Linq;

namespace Quizine.Api.Models.Rulesets
{
    public class StandardRuleset : Ruleset
    {
        public override string Description => "Play a standard game of Quizine.";

        public override bool EnableSkip => false;

        public override int CalculateMaxScore(IEnumerable<QuizItem> questions)
        {
            return questions.Count() * PointsFactor;
        }

        /// <summary>
        /// Correct answer: +1
        /// Incorrect answer: +-0
        /// </summary>
        /// <param name="results"></param>
        /// <returns></returns>
        public override int CalculateScore(IEnumerable<QuizResult> results)
        {
            return results.Where(x => x.Question.CorrectAnswer.ID == x.Answer.ID).Count() * PointsFactor;
        }
    }
}
