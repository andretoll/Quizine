using Quizine.Api.Models.Base;
using System.Collections.Generic;

namespace Quizine.Api.Models.Rulesets
{
    public class BalancedRuleset : Ruleset
    {
        public override bool EnableSkip => false;

        public override string Description => "The more difficult the question is, the more points you get.";

        public override string Title => "Balanced";

        private int ConvertDifficultyToPoints(string difficulty)
        {
            const int EASY_POINTS = 1;
            const int MEDIUM_POINTS = 2;
            const int HARD_POINTS = 3;

            return difficulty.ToLower() switch
            {
                "easy" => EASY_POINTS * PointsFactor,
                "medium" => MEDIUM_POINTS * PointsFactor,
                "hard" => HARD_POINTS * PointsFactor,
                _ => EASY_POINTS * PointsFactor,
            };
        }

        public override int CalculateMaxScore(IEnumerable<QuizItem> questions)
        {
            int maxScore = 0;

            foreach (var question in questions)
            {
                maxScore += ConvertDifficultyToPoints(question.Difficulty);
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
                    score += ConvertDifficultyToPoints(result.Question.Difficulty);
                }
            }

            return score;
        }

        public override int GetQuestionPoints(QuizResult result)
        {
            if (result != null && result.IsAnswerCorrect)
            {
                return ConvertDifficultyToPoints(result.Question.Difficulty);
            }

            return 0;
        }
    }
}
