using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.Extensions.Logging;
using Quizine.Api.Attributes;
using Quizine.Api.Dtos;
using Quizine.Api.Enums;
using Quizine.Api.Helpers;
using Quizine.Api.Interfaces;
using Quizine.Api.Models;
using Quizine.Api.Models.Base;
using System;
using System.Collections.Generic;
using System.Text.Json;
using System.Threading.Tasks;

namespace Quizine.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [ApiKey]
    public class QuizController : ControllerBase
    {
        #region Private Members

        private readonly ISessionRepository _sessionRepository;
        private readonly ITriviaRespository _triviaRepository;
        private readonly ILogger _logger;

        #endregion

        #region Constructor

        public QuizController(ISessionRepository sessionRepository, ITriviaRespository triviaRespository, ILogger<QuizController> logger)
        {
            _logger = logger;
            _logger.LogTrace("Constructor");

            _sessionRepository = sessionRepository;
            _triviaRepository = triviaRespository;
        }

        #endregion
        
        #region Endpoints

        [HttpPost("create")]
        public async Task<ActionResult> Create([FromBody] SessionParameters parameters)
        {
            _logger.LogInformation($"Called '{ControllerContext.ActionDescriptor.ActionName}' endpoint");

            string sessionId = UIDGenerator.Generate();
            parameters.SessionID = sessionId;

            _logger.LogDebug("Fetching trivia...");
            var quizItems = await _triviaRepository.GetTrivia(parameters.QuestionCount, parameters.Category, parameters.Difficulty);

            _logger.LogDebug("Creating session...");
            _sessionRepository.AddSession(parameters, quizItems);

            _logger.LogDebug($"Returning session ID: {sessionId}");
            return Ok(JsonSerializer.Serialize(sessionId));
        }

        [HttpGet("categories")]
        public async Task<ActionResult> GetCategories()
        {
            _logger.LogInformation($"Called '{ControllerContext.ActionDescriptor.ActionName}' endpoint");

            var response = await _triviaRepository.GetCategoriesJsonString();

            if (string.IsNullOrEmpty(response))
            {
                return BadRequest("Encountered an error while fetching categories");
            }
            else
            {
                _logger.LogDebug($"Returning categories");
                return Ok(response);
            }
        }

        [HttpGet("rules")]
        public ActionResult GetRules()
        {
            _logger.LogInformation($"Called '{ControllerContext.ActionDescriptor.ActionName}' endpoint");

            List<RulesetDto> rulesets = new();

            foreach (var rule in Enum.GetValues<Rule>())
            {
                rulesets.Add(new RulesetDto(rule, Ruleset.Parse(rule).Description));
            }

            _logger.LogDebug($"Returning {rulesets.Count} rulesets");
            return Ok(rulesets);
        } 

        #endregion
    }
}
