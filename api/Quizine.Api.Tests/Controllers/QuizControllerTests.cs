﻿using Microsoft.AspNetCore.Mvc;
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
using System.Threading.Tasks;

namespace Quizine.Api.Tests.Controllers
{
    [TestFixture]
    public class QuizControllerTests
    {
        private ISessionRepository _sessionRepository;
        private ITriviaRespository _triviaRespository;
        private QuizController _controller;

        [SetUp]
        public void Setup()
        {
            _sessionRepository = new SessionRepository();
            _triviaRespository = new TriviaRepositoryStub();
            _controller = new QuizController(_sessionRepository, _triviaRespository, new ILoggerStub<QuizController>());
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

        [Test(Description = "Asserts that a bad request response is returned when validation fails.")]
        public async Task ShouldReturnBadRequestOnValidationError()
        {
            // Arrange
            var parameters = new SessionParameters();

            // Act
            _controller.ModelState.AddModelError("", "invalid data");
            var result = await _controller.Create(parameters);

            // Assert
            Assert.That(result, Is.TypeOf<BadRequestObjectResult>());
        }
    }
}
