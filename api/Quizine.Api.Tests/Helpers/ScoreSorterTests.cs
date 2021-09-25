using NUnit.Framework;
using Quizine.Api.Enums;
using Quizine.Api.Helpers;
using Quizine.Api.Models;
using Quizine.Api.Models.Base;
using Quizine.Api.Tests.Utils;
using System.Linq;

namespace Quizine.Api.Tests.Helpers
{
    [TestFixture]
    public class ScoreSorterTests
    {
        [Test]
        public void ShouldSortByDescendingScore()
        {
            // Arrange
            string userId1 = TestData.GetRandomString(8);
            string userId2 = TestData.GetRandomString(8);
            string userId3 = TestData.GetRandomString(8);
            string userId4 = TestData.GetRandomString(8);
            string userId5 = TestData.GetRandomString(8);

            User[] users = new User[] 
            { 
                new User { UserID = userId1}, 
                new User { UserID = userId2 }, 
                new User { UserID = userId3 },
                new User { UserID = userId4 },
                new User { UserID = userId5 },
            };
            var progressList = TestData.GetRandomQuizProgressList(users, 8).ToList();

            // Act
            foreach (var progress in progressList)
            {
                progress.CalculateScore(Ruleset.Parse(Rule.Standard));
            }
            progressList = ScoreSorter.Sort(progressList, ScoreSortType.ScoreDescending).ToList();
            var orderedList = progressList.OrderByDescending(x => x.Score);

            // Assert
            Assert.That(progressList.SequenceEqual(orderedList), Is.True);
            for (int i = 0; i < progressList.Count(); i++)
            {
                if (i < progressList.Count() - 1)
                    Assert.That(progressList[i].Score, Is.GreaterThanOrEqualTo(progressList[i + 1].Score));
            }
        }
    }
}
