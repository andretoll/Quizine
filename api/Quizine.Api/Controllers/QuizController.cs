using Microsoft.AspNetCore.Mvc;
using Quizine.Api.Attributes;
using Quizine.Api.Enums;
using Quizine.Api.Helpers;
using Quizine.Api.Interfaces;
using Quizine.Api.Models;
using System;
using System.Text.Json;
using System.Threading.Tasks;

namespace Quizine.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [ApiKey]
    public class QuizController : ControllerBase
    {
        private readonly ISessionRepository _sessionRepository;
        private readonly ITriviaRespository _triviaRepository;

        public QuizController(ISessionRepository sessionRepository, ITriviaRespository triviaRespository)
        {
            _sessionRepository = sessionRepository;
            _triviaRepository = triviaRespository;
        }

        [HttpPost("create")]
        public async Task<ActionResult> Post([FromBody]SessionParameters parameters)
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
            return Ok(Enum.GetNames<Rule>());
        }
    }
}
