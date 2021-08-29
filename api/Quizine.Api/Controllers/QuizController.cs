using Microsoft.AspNetCore.Mvc;
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

        #endregion

        #region Constructor

        public QuizController(ISessionRepository sessionRepository, ITriviaRespository triviaRespository)
        {
            _sessionRepository = sessionRepository;
            _triviaRepository = triviaRespository;
        }

        #endregion

        #region Endpoints

        [HttpPost("create")]
        public async Task<ActionResult> Post([FromBody] SessionParameters parameters)
        {
            string sessionId = UIDGenerator.Generate();
            parameters.SessionID = sessionId;

            var quizItems = await _triviaRepository.GetTrivia(parameters.QuestionCount, parameters.Category, parameters.Difficulty);

            _sessionRepository.AddSession(parameters, quizItems);

            return Ok(JsonSerializer.Serialize(sessionId));
        }

        [HttpGet("categories")]
        public async Task<ActionResult> GetCategories()
        {
            var response = await _triviaRepository.GetCategoriesJsonString();

            if (string.IsNullOrEmpty(response))
                return BadRequest();
            else
                return Ok(response);
        }

        [HttpGet("rules")]
        public ActionResult GetRules()
        {
            List<RulesetDto> rulesets = new();

            foreach (var rule in Enum.GetValues<Rule>())
            {
                rulesets.Add(new RulesetDto(rule, Ruleset.Parse(rule).Description));
            }

            return Ok(rulesets);
        } 

        #endregion
    }
}
