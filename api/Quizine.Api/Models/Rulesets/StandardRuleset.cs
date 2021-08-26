using Quizine.Api.Models.Base;
using System.Collections.Generic;
using System.Linq;

namespace Quizine.Api.Models.Rulesets
{
    public class StandardRuleset : Ruleset
    {
        public override int CalculateMaxScore(IEnumerable<QuizItem> questions)
        {
            return questions.Count() * 1;
        }

        public override int CalculateScore(IEnumerable<QuizResult> results)
        {
            return results.Where(x => x.Question.CorrectAnswer.ID == x.Answer.ID).Count() * 1;
        }
    }
}
