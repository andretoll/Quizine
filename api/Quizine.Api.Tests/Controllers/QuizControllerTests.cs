using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Controllers;
using NUnit.Framework;
using Quizine.Api.Controllers;
using Quizine.Api.Dtos;
using Quizine.Api.Enums;
using Quizine.Api.Interfaces;
using Quizine.Api.Models;
using Quizine.Api.Services;
using Quizine.Api.Tests.Stubs;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace Quizine.Api.Tests.Controllers
{
    [TestFixture]
    public class QuizControllerTests
    {
        private ISessionRepository _sessionRepository;
        private ITriviaRespository _triviaRespository;
        private IResourceManagerParameters _parameters;
        private QuizController _controller;

        [SetUp]
        public void Setup()
        {
            _sessionRepository = new SessionRepository(new ILoggerStub<SessionRepository>());
            _triviaRespository = new TriviaRepositoryStub();
            _parameters = new ResourceManagerParametersStub(TimeSpan.FromMinutes(5), TimeSpan.FromMinutes(5), TimeSpan.FromMinutes(1));
            _controller = new QuizController(_sessionRepository, _triviaRespository, _parameters, new ILoggerStub<QuizController>());
            _controller.ControllerContext.ActionDescriptor = new ControllerActionDescriptor() { ActionName = "" };
        }

        [Test(Description = "Asserts that categories are fetched successfully.")]
        public async Task ShouldGetCategories()
        {
            // Arrange & Act
            var result = await _controller.GetCategories();

            // Assert
            Assert.That(result, Is.TypeOf<OkObjectResult>());
            Assert.That(string.IsNullOrEmpty(((result as OkObjectResult).Value as string)), Is.False);
        }

        [Test(Description = "Asserts that all rules are fetched successfully.")]
        public void ShouldGetRules()
        {
            // Arrange & Act
            var result = _controller.GetRules();

            // Assert
            Assert.That(result, Is.TypeOf<OkObjectResult>());
            Assert.That((result as OkObjectResult).Value, Is.TypeOf<List<RulesetDto>>());
            Assert.That(((result as OkObjectResult).Value as List<RulesetDto>), Has.Count.EqualTo(Enum.GetNames<Rule>().Length));
        }

        [Test]
        public void ShouldGetSessionLifetime()
        {
            // Arrange & Act
            var result = _controller.GetSessionLifetime();
            _ = double.TryParse((result as OkObjectResult).Value.ToString(), out double value);

            // Assert
            Assert.That(result, Is.TypeOf<OkObjectResult>());
            Assert.That((result as OkObjectResult).Value, Is.TypeOf<double>());
            Assert.That(value, Is.GreaterThan(0));
            Assert.That(TimeSpan.FromMinutes(value), Is.EqualTo(_parameters.SessionLifetime));
        }

        [TestCase(Rule.Standard, "A title", 9, 10, 30, 0, "Hard", Description = "Asserts that quiz sessions can be created and that session ID is returned.")]
        public async Task ShouldCreateSession(Rule rule, string title, int playerCount, int questionCount, int questionTimeout, int category, string difficulty)
        {
            // Arrange
            var parameters = new SessionParameters()
            {
                Rule = rule,
                Title = title,
                PlayerCount = playerCount,
                QuestionCount = questionCount,
                QuestionTimeout = questionTimeout,
                Category = category,
                Difficulty = difficulty
            };

            // Act
            var result = await _controller.Create(parameters);

            // Assert
            Assert.That(result, Is.TypeOf<OkObjectResult>());
            Assert.That((result as OkObjectResult).Value, Is.TypeOf<string>());
            Assert.That((result as OkObjectResult).Value as string, Is.Not.Empty);
            Assert.That(_sessionRepository.SessionExists(((result as OkObjectResult).Value as string).Trim('"')));
        }

        [Test]
        public async Task ShouldCreateIdenticalRematch()
        {
            // Arrange
            var parameters = Utils.TestData.GetRandomSessionParameters();

            string oldSessionId = ((await _controller.Create(parameters)) as OkObjectResult).Value.ToString().Trim('"');
            var oldSession = _sessionRepository.GetSessionBySessionId(oldSessionId);

            // Act
            string newSessionId = ((await _controller.Create(oldSessionId)) as OkObjectResult).Value.ToString().Trim('"');
            var newSession = _sessionRepository.GetSessionBySessionId(newSessionId);

            // Assert
            Assert.That(string.IsNullOrEmpty(newSessionId), Is.False);
            Assert.That(_sessionRepository.SessionExists(newSessionId), Is.True);
            Assert.That(newSession.MemberProgressList.Count(), Is.EqualTo(0));
            Assert.That(newSession.IsCompleted, Is.False);
            Assert.That(newSession.IsStarted, Is.False);

            Assert.That(newSession.QuestionCount, Is.EqualTo(oldSession.QuestionCount));
            Assert.That(newSession.Ruleset.Title, Is.EqualTo(oldSession.Ruleset.Title));
            Assert.That(newSession.SessionParameters.Category, Is.EqualTo(oldSession.SessionParameters.Category));
            Assert.That(newSession.SessionParameters.Difficulty, Is.EqualTo(oldSession.SessionParameters.Difficulty));
            Assert.That(newSession.SessionParameters.PlayerCount, Is.EqualTo(oldSession.SessionParameters.PlayerCount));
            Assert.That(newSession.SessionParameters.QuestionTimeout, Is.EqualTo(oldSession.SessionParameters.QuestionTimeout));
            Assert.That(newSession.SessionParameters.Rule, Is.EqualTo(oldSession.SessionParameters.Rule));
            Assert.That(newSession.SessionParameters.Title, Is.EqualTo(oldSession.SessionParameters.Title));
            Assert.That(newSession.SessionParameters.SessionID, Is.Not.EqualTo(oldSession.SessionParameters.SessionID));
            Assert.That(newSession.Questions.First().Question, Is.Not.EqualTo(oldSession.Questions.First().Question));
        }
    }
}
