using NUnit.Framework;
using Quizine.Api.Enums;
using Quizine.Api.Interfaces;
using Quizine.Api.Models;
using Quizine.Api.Services;
using Quizine.Api.Tests.Utils;
using System.Collections.Generic;
using System.Linq;

namespace Quizine.Api.Tests.Services
{
    [TestFixture]
    public class QuizSessionTests
    {
        private static IQuizSession CreateSession(SessionParameters parameters, IEnumerable<QuizItem> quizItems)
        {
            return new QuizSession(parameters, quizItems);
        }

        private static void AddUser(IQuizSession session, string connectionId, string username)
        {
            session.AddUser(connectionId, username);
        }

        [TestCase]
        public void ShouldGetFirstQuestion()
        {
            // Arrange
            var sessionParameters = TestData.GetRandomSessionParameters();
            var quizItems = TestData.GetRandomQuizItems(sessionParameters.QuestionCount);
            string connectionId = TestData.GetRandomString(8);
            string username = TestData.GetRandomString(8);
            var session = CreateSession(sessionParameters, quizItems);
            AddUser(session, connectionId, username);

            // Act
            var firstQuestion = session.GetNextUserQuestion(connectionId, out _);

            // Assert
            Assert.That(firstQuestion, Is.Not.Null);
            Assert.That(firstQuestion, Is.EqualTo(quizItems.First()));
        }

        [Test]
        public void ShouldGetLastQuestion()
        {
            // Arrange
            var sessionParameters = TestData.GetRandomSessionParameters();
            var quizItems = TestData.GetRandomQuizItems(2);
            string connectionId = TestData.GetRandomString(8);
            string username = TestData.GetRandomString(8);
            var session = CreateSession(sessionParameters, quizItems);
            AddUser(session, connectionId, username);

            // Act
            var firstQuestion = session.GetNextUserQuestion(connectionId, out bool expectingFalse);
            session.SubmitAnswer(connectionId, firstQuestion.ID, firstQuestion.CorrectAnswer.ID, out _);
            _ = session.GetNextUserQuestion(connectionId, out bool expectingTrue);

            // Assert
            Assert.That(expectingFalse, Is.False);
            Assert.That(expectingTrue, Is.True);
        }

        [Test]
        public void ShouldReturnCorrectAnswerIdWhenSubmittingCorrectAnswer()
        {
            // Arrange
            var sessionParameters = TestData.GetRandomSessionParameters();
            var quizItems = TestData.GetRandomQuizItems(2);
            string connectionId = TestData.GetRandomString(8);
            string username = TestData.GetRandomString(8);
            var session = CreateSession(sessionParameters, quizItems);
            AddUser(session, connectionId, username);

            // Act
            var question = session.GetNextUserQuestion(connectionId, out _);
            string correctAnswerId = session.SubmitAnswer(connectionId, question.ID, question.CorrectAnswer.ID, out _);

            // Assert
            Assert.That(correctAnswerId, Is.EqualTo(question.CorrectAnswer.ID));
        }

        [Test]
        public void ShouldReturnCorrectAnswerIdWhenSubmittingIncorrectAnswer()
        {
            // Arrange
            var sessionParameters = TestData.GetRandomSessionParameters();
            var quizItems = TestData.GetRandomQuizItems(2);
            string connectionId = TestData.GetRandomString(8);
            string username = TestData.GetRandomString(8);
            var session = CreateSession(sessionParameters, quizItems);
            AddUser(session, connectionId, username);

            // Act
            var question = session.GetNextUserQuestion(connectionId, out _);
            string correctAnswerId = session.SubmitAnswer(connectionId, question.ID, question.Answers.First(x => x.ID != question.CorrectAnswer.ID).ID, out _);

            // Assert
            Assert.That(correctAnswerId, Is.EqualTo(question.CorrectAnswer.ID));
        }

        [Test]
        public void ShouldRegisterAnswer()
        {
            // Arrange
            var sessionParameters = TestData.GetRandomSessionParameters();
            var quizItems = TestData.GetRandomQuizItems(2);
            string userId = TestData.GetRandomString(8);
            string username = TestData.GetRandomString(8);
            var session = CreateSession(sessionParameters, quizItems);
            AddUser(session, userId, username);
            var progress = session.MemberProgressList.First(x => x.User.UserID == userId);

            // Act
            var question = session.GetNextUserQuestion(userId, out bool expectingFalse);
            var answer = question.CorrectAnswer;
            session.SubmitAnswer(userId, question.ID, answer.ID, out _);
            var result = progress.QuizResults.First(x => x.Question.ID == question.ID);

            // Assert
            Assert.That(result.Question, Is.EqualTo(question));
            Assert.That(result.Answer.ID, Is.EqualTo(answer.ID));
        }

        [Test]
        public void ShouldHaveNullAnswersOnInit()
        {
            // Arrange
            var sessionParameters = TestData.GetRandomSessionParameters();
            var quizItems = TestData.GetRandomQuizItems(2);
            string userId = TestData.GetRandomString(8);
            string username = TestData.GetRandomString(8);
            var session = CreateSession(sessionParameters, quizItems);
            AddUser(session, userId, username);

            // Act
            var progress = session.MemberProgressList.First(x => x.User.UserID == userId);

            // Assert
            Assert.That(progress.QuizResults.All(x => x.Answer == null));
        }

        [TestCase(Rule.Standard)]
        [TestCase(Rule.Risk)]
        public void ShouldReachMaxScore(Rule rule)
        {
            // Arrange
            var sessionParameters = TestData.GetRandomSessionParameters(rule);
            var quizItems = TestData.GetRandomQuizItems(4);
            string userId = TestData.GetRandomString(8);
            string username = TestData.GetRandomString(8);
            var session = CreateSession(sessionParameters, quizItems);
            AddUser(session, userId, username);

            // Act
            for (int i = 0; i < quizItems.Count(); i++)
            {
                var question = session.GetNextUserQuestion(userId, out _);
                session.SubmitAnswer(userId, question.ID, question.CorrectAnswer.ID, out _);
            }
            var result = session.GetResults().First(x => x.User.UserID == userId);

            // Assert
            Assert.That(result.Score, Is.EqualTo(session.MaxScore));
        }

        [Test]
        public void ShouldNotGetResultsIfNotCompleted()
        {
            // Arrange
            var sessionParameters = TestData.GetRandomSessionParameters();
            var quizItems = TestData.GetRandomQuizItems(3);
            string connectionId = TestData.GetRandomString(8);
            string username = TestData.GetRandomString(8);
            var session = CreateSession(sessionParameters, quizItems);
            AddUser(session, connectionId, username);

            // Act
            for (int i = 0; i < quizItems.Count() - 1; i++)
            {
                var question = session.GetNextUserQuestion(connectionId, out _);
                session.SubmitAnswer(connectionId, question.ID, question.CorrectAnswer.ID, out _);
            }
            var result = session.GetResults().ToList();

            // Assert
            Assert.That(result, Has.Count.EqualTo(0));
        }

        [Test]
        public void ShouldGetResultsForMultiplePlayers()
        {
            // Arrange
            var sessionParameters = TestData.GetRandomSessionParameters();
            var quizItems = TestData.GetRandomQuizItems(4);
            string connectionId1 = TestData.GetRandomString(8);
            string connectionId2 = TestData.GetRandomString(8);
            string connectionId3 = TestData.GetRandomString(8);
            var session = CreateSession(sessionParameters, quizItems);
            AddUser(session, connectionId1, TestData.GetRandomString(8));
            AddUser(session, connectionId2, TestData.GetRandomString(8));
            AddUser(session, connectionId3, TestData.GetRandomString(8));

            // Act
            for (int i = 0; i < quizItems.Count(); i++)
            {
                var question = session.GetNextUserQuestion(connectionId1, out _);
                session.SubmitAnswer(connectionId1, question.ID, question.CorrectAnswer.ID, out _);
            }
            for (int i = 0; i < quizItems.Count(); i++)
            {
                var question = session.GetNextUserQuestion(connectionId2, out _);
                session.SubmitAnswer(connectionId2, question.ID, question.CorrectAnswer.ID, out _);
            }
            for (int i = 0; i < quizItems.Count() - 1; i++)
            {
                var question = session.GetNextUserQuestion(connectionId3, out _);
                session.SubmitAnswer(connectionId3, question.ID, question.CorrectAnswer.ID, out _);
            }
            var result = session.GetResults().ToList();

            // Assert
            Assert.That(result, Has.Count.EqualTo(2));
        }

        [Test]
        public void ShouldCompleteSessionWhenAllPlayersHasCompleted()
        {
            // Arrange
            var sessionParameters = TestData.GetRandomSessionParameters();
            var quizItems = TestData.GetRandomQuizItems(4);
            string connectionId1 = TestData.GetRandomString(8);
            string connectionId2 = TestData.GetRandomString(8);
            string connectionId3 = TestData.GetRandomString(8);
            var session = CreateSession(sessionParameters, quizItems);
            AddUser(session, connectionId1, TestData.GetRandomString(8));
            AddUser(session, connectionId2, TestData.GetRandomString(8));
            AddUser(session, connectionId3, TestData.GetRandomString(8));
            session.Start();

            // Act
            for (int i = 0; i < quizItems.Count(); i++)
            {
                var question = session.GetNextUserQuestion(connectionId1, out _);
                session.SubmitAnswer(connectionId1, question.ID, question.CorrectAnswer.ID, out _);
            }
            for (int i = 0; i < quizItems.Count(); i++)
            {
                var question = session.GetNextUserQuestion(connectionId2, out _);
                session.SubmitAnswer(connectionId2, question.ID, question.CorrectAnswer.ID, out _);
            }
            bool expectingFalse = session.IsCompleted;
            for (int i = 0; i < quizItems.Count(); i++)
            {
                var question = session.GetNextUserQuestion(connectionId3, out _);
                session.SubmitAnswer(connectionId3, question.ID, question.CorrectAnswer.ID, out _);
            }
            var result = session.GetResults().ToList();
            bool expectingTrue = session.IsCompleted;

            // Assert
            Assert.That(result, Has.Count.EqualTo(3));
            Assert.That(expectingFalse, Is.False);
            Assert.That(expectingTrue, Is.True);
        }

        [TestCase("James Bond", "James Bond")]
        [TestCase("James bond", "james Bond")]
        [TestCase("james bond", "JAMES BOND")]
        public void ShouldCheckIdenticalUsername(string username1, string username2)
        {
            // Arrange
            var sessionParameters = TestData.GetRandomSessionParameters();
            var quizItems = TestData.GetRandomQuizItems(4);
            string connectionId1 = TestData.GetRandomString(8);
            var session = CreateSession(sessionParameters, quizItems);
            AddUser(session, connectionId1, username1);

            // Act
            bool expectingTrue = session.UsernameTaken(username2);

            // Assert
            Assert.That(expectingTrue, Is.True);
        }
    }
}
