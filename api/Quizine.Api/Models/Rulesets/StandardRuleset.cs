﻿using Quizine.Api.Models.Base;
using System.Collections.Generic;
using System.Linq;

namespace Quizine.Api.Models.Rulesets
{
    public class StandardRuleset : Ruleset
    {
        public override string Description => "Play a standard game of Quizine.";

        public override bool EnableSkip => false;

        public override string Title => "Standard";

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
            return results.Where(x => x.IsAnswerCorrect).Count() * PointsFactor;
        }

        public override int GetQuestionPoints(QuizResult result)
        {
            return result != null && result.IsAnswerCorrect ? PointsFactor : 0;
        }
    }
}
