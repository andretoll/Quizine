using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Controllers;
using NUnit.Framework;
using Quizine.Api.Controllers;
using Quizine.Api.Interfaces;
using Quizine.Api.Models;
using Quizine.Api.Services;
using Quizine.Api.Tests.Stubs;
using Quizine.Api.Tests.Utils;
using System;
using System.Threading.Tasks;

namespace Quizine.Api.Tests.Services
{
    [TestFixture]
    public class SessionRepositoryTests
    {
        private ISessionRepository _sessionRepository;
        private QuizController _quizController;

        [SetUp]
        public void Setup()
        {
            _sessionRepository = new SessionRepository(new ILoggerStub<SessionRepository>());
            var parameters = new ResourceManagerParametersStub(TimeSpan.FromMinutes(5), TimeSpan.FromMinutes(1));
            _quizController = new QuizController(_sessionRepository, new TriviaRepositoryStub(), parameters, new ILoggerStub<QuizController>());
            _quizController.ControllerContext.ActionDescriptor = new ControllerActionDescriptor() { ActionName = "" };
        }

        private async Task<string> CreateSession(SessionParameters parameters)
        {
            var result = await _quizController.Create(parameters);
            return ((result as OkObjectResult).Value as string).Trim('"');
        }

        [Test]
        public async Task ShouldAddSession()
        {
            // Arrange
            var sessionParameters = TestData.GetRandomSessionParameters();

            // Act
            var sessionId = await CreateSession(sessionParameters);

            // Assert
            Assert.That(_sessionRepository.SessionExists(sessionId), Is.True);
            Assert.That(_sessionRepository.GetSessionBySessionId(sessionId), Is.Not.Null);
        }

        [Test]
        public async Task ShouldAddSessionAndGenerateQuizItems()
        {
            // Arrange
            var sessionParameters = TestData.GetRandomSessionParameters();

            // Act
            var sessionId = await CreateSession(sessionParameters);
            var session = _sessionRepository.GetSessionBySessionId(sessionId);

            // Assert
            Assert.That(session.QuestionCount, Is.GreaterThan(0));
            Assert.That(session.QuestionCount, Is.EqualTo(sessionParameters.QuestionCount));
        }

        [Test]
        public async Task ShouldInitializeSession()
        {
            // Arrange
            var sessionParameters = TestData.GetRandomSessionParameters();

            // Act
            var sessionId = await CreateSession(sessionParameters);
            var session = _sessionRepository.GetSessionBySessionId(sessionId);

            // Assert
            Assert.That(_sessionRepository.SessionStarted(sessionId), Is.False);
            Assert.That(session.GetUsers(), Has.Count.EqualTo(0));
            Assert.That(session.MemberProgressList, Has.Count.EqualTo(0));
            Assert.That(session.Ruleset, Is.Not.Null);
        }

        [Test]
        public async Task ShouldAddUser()
        {
            // Arrange
            string username = TestData.GetRandomString(8);
            string connectionId = TestData.GetRandomString(10);
            var sessionParameters = TestData.GetRandomSessionParameters();

            // Act
            var sessionId = await CreateSession(sessionParameters);
            var session = _sessionRepository.GetSessionBySessionId(sessionId);
            session.AddUser(connectionId, username);

            // Assert
            Assert.That(session.UserExists(connectionId), Is.True);
            Assert.That(session.GetUsers(), Has.Count.EqualTo(1));
            Assert.That(session.MemberProgressList, Has.Count.EqualTo(1));
            Assert.That(session.GetUser(connectionId).ConnectionID, Is.EqualTo(connectionId));
            Assert.That(session.GetUser(connectionId).Username, Is.EqualTo(username));
        }

        [Test]
        public async Task ShouldRemoveUser()
        {
            // Arrange
            string username = TestData.GetRandomString(8);
            string connectionId = TestData.GetRandomString(10);
            string usernameToRemove = TestData.GetRandomString(8);
            string connectionIdToRemove = TestData.GetRandomString(10);
            var sessionParameters = TestData.GetRandomSessionParameters();

            // Act
            var sessionId = await CreateSession(sessionParameters);
            var session = _sessionRepository.GetSessionBySessionId(sessionId);
            session.AddUser(connectionId, username);
            session.AddUser(connectionIdToRemove, usernameToRemove);
            session.RemoveUser(connectionIdToRemove);

            // Assert
            Assert.That(session.GetUsers(), Has.Count.EqualTo(1));
            Assert.That(session.MemberProgressList, Has.Count.EqualTo(1));
            Assert.That(session.UserExists(connectionId), Is.True);
            Assert.That(session.UserExists(connectionIdToRemove), Is.False);
        }

        [Test]
        public async Task ShouldHaveFullSession()
        {
            // Arrange
            var sessionParameters = TestData.GetRandomSessionParameters();

            // Act
            var sessionId = await CreateSession(sessionParameters);
            var session = _sessionRepository.GetSessionBySessionId(sessionId);

            // Assert
            for (int i = 0; i < sessionParameters.PlayerCount; i++)
            {
                Assert.That(_sessionRepository.SessionFull(sessionId), Is.False);
                session.AddUser(TestData.GetRandomString(8), TestData.GetRandomString(8));
            }
            Assert.That(session.GetUsers(), Has.Count.EqualTo(sessionParameters.PlayerCount));
            Assert.That(_sessionRepository.SessionFull(sessionId), Is.True);
        }

        [Test]
        public async Task ShouldGetSessionBySessionId()
        {
            // Arrange
            var sessionParameters = TestData.GetRandomSessionParameters();

            // Act
            var sessionId = await CreateSession(sessionParameters);
            var session = _sessionRepository.GetSessionBySessionId(sessionId);

            // Assert
            Assert.That(session, Is.Not.Null);
        }

        [Test]
        public async Task ShouldGetSessionByConnectionId()
        {
            // Arrange
            string username = TestData.GetRandomString(8);
            string connectionId = TestData.GetRandomString(10);
            var sessionParameters = TestData.GetRandomSessionParameters();

            // Act
            var sessionId = await CreateSession(sessionParameters);
            var session = _sessionRepository.GetSessionBySessionId(sessionId);
            session.AddUser(connectionId, username);
            session = _sessionRepository.GetSessionByConnectionId(connectionId);

            // Assert
            Assert.That(session, Is.Not.Null);
        }

        [Test]
        public async Task ShouldStartSession()
        {
            // Arrange
            var sessionParameters = TestData.GetRandomSessionParameters();

            // Act
            var sessionId = await CreateSession(sessionParameters);
            bool expectingFalse = _sessionRepository.SessionStarted(sessionId);
            _sessionRepository.StartSession(sessionId);
            bool expectingTrue = _sessionRepository.SessionStarted(sessionId);

            // Assert
            Assert.That(expectingFalse, Is.False);
            Assert.That(expectingTrue, Is.True);
        }

        [Test]
        public async Task ShouldThrowExceptionWhenStartingSessionTwice()
        {
            // Arrange
            var sessionParameters = TestData.GetRandomSessionParameters();

            // Act
            var sessionId = await CreateSession(sessionParameters);

            // Assert
            Assert.DoesNotThrow(() =>
            {
                _sessionRepository.StartSession(sessionId);
            });
            Assert.Throws<InvalidOperationException>(() =>
            {
                _sessionRepository.StartSession(sessionId);
            });
        }
    }
}
