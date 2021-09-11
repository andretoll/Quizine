using Quizine.Api.Models.Base;
using System;
using System.Collections.Generic;

namespace Quizine.Api.Models.Rulesets
{
    public class BalancedRuleset : Ruleset
    {
        private const int EASY_POINTS = 1;
        private const int MEDIUM_POINTS = 2;
        private const int HARD_POINTS = 3;

        public override bool EnableSkip => false;

        public override string Description => "The more difficult the question is, the more points you get.";

        public override string Title => "Balanced";

        public override int CalculateMaxScore(IEnumerable<QuizItem> questions)
        {
            int maxScore = 0;

            foreach (var question in questions)
            {
                switch (question.Difficulty.ToLower())
                {
                    case "easy":
                        maxScore += EASY_POINTS * PointsFactor;
                        break;
                    case "medium":
                        maxScore += MEDIUM_POINTS * PointsFactor;
                        break;
                    case "hard":
                        maxScore += HARD_POINTS * PointsFactor;
                        break;
                    default:
                        maxScore += EASY_POINTS * PointsFactor;
                        break;
                }
            }

            return maxScore;
        }

        public override int CalculateScore(IEnumerable<QuizResult> results)
        {
            int score = 0;

            foreach (var result in results)
            {
                if (result.Answer.IsAnswerValid() && result.IsAnswerCorrect)
                {
                    switch (result.Question.Difficulty.ToLower())
                    {
                        case "easy":
                            score += EASY_POINTS * PointsFactor;
                            break;
                        case "medium":
                            score += MEDIUM_POINTS * PointsFactor;
                            break;
                        case "hard":
                            score += HARD_POINTS * PointsFactor;
                            break;
                        default:
                            throw new NotSupportedException("Difficulty level not supported");
                    }
                }
            }

            return score;
        }
    }
}
