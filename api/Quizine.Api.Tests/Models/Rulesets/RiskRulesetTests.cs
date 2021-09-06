using NUnit.Framework;
using Quizine.Api.Models;
using Quizine.Api.Models.Rulesets;
using System.Collections.Generic;
using System.Linq;

namespace Quizine.Api.Tests.Models.Rulesets
{
    [TestFixture]
    public class RiskRulesetTests
    {
        [Test]
        public void ShouldNotHaveNegativeScore()
        {
            // Arrange
            var ruleset = new RiskRuleset();
            var quizResults = new List<QuizResult>();
            var result1 = new QuizResult(new QuizItem("", "", "", "", 0, "correct", new string[] { "incorrect", "correct" }));
            result1.SetAnswer(result1.Question.Answers.First(x => x.ID != result1.Question.CorrectAnswer.ID));
            quizResults.Add(result1);

            // Act
            int score = ruleset.CalculateScore(quizResults);

            // Assert
            Assert.That(score, Is.EqualTo(0));
        }
    }
}
