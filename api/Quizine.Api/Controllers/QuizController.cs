using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.Cookies;
using Microsoft.AspNetCore.Mvc;
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
using System.Security.Claims;
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
        private readonly IResourceManagerParameters _parameters;
        private readonly ILogger _logger;

        #endregion

        #region Constructor

        public QuizController(
            ISessionRepository sessionRepository, 
            ITriviaRespository triviaRespository,
            IResourceManagerParameters parameters,
            ILogger<QuizController> logger)
        {
            _logger = logger;
            _logger.LogTrace("Constructor");

            _sessionRepository = sessionRepository;
            _triviaRepository = triviaRespository;
            _parameters = parameters;
        }

        #endregion
        
        #region Endpoints

        [HttpPost("create")]
        public async Task<ActionResult> Create([FromBody] SessionParameters parameters)
        {
            _logger.LogTrace($"Called '{ControllerContext.ActionDescriptor.ActionName}' endpoint");

            string sessionId = UIDGenerator.Generate();
            parameters.SessionID = sessionId;

            _logger.LogDebug("Fetching trivia...");
            var quizItems = await _triviaRepository.GetTrivia(parameters.QuestionCount, parameters.Category, parameters.Difficulty);

            _logger.LogDebug("Creating session...");
            _sessionRepository.AddSession(parameters, quizItems);

            _logger.LogDebug($"Returning session ID: {sessionId}");
            return Ok(JsonSerializer.Serialize(sessionId));
        }

        [HttpPost("rematch")]
        public async Task<ActionResult> Create([FromBody] string sessionId)
        {
            _logger.LogTrace($"Called (Rematch) '{ControllerContext.ActionDescriptor.ActionName}' endpoint");

            var session = _sessionRepository.GetSessionBySessionId(sessionId);

            if (session == null)
            {
                _logger.LogError("Session does not exist");
                return BadRequest("Session does not exist");
            }

            var result = await Create(JsonSerializer.Deserialize<SessionParameters>(JsonSerializer.Serialize(session.SessionParameters)));

            if (result.GetType() == typeof(OkObjectResult))
            {
                string newSessionId = (result as OkObjectResult).Value.ToString();
                _logger.LogDebug($"Returning session ID: {newSessionId}");
                return Ok(newSessionId);
            }

            return BadRequest((result as ObjectResult).Value.ToString());
        }

        [HttpPost("join")]
        public async Task<ActionResult> Join([FromBody] JoinDto dto)
        {
            _logger.LogTrace($"Called '{ControllerContext.ActionDescriptor.ActionName}' endpoint");
            
            if (!_sessionRepository.SessionExists(dto.SessionId))
            {
                _logger.LogDebug("Session does not exist");
                return BadRequest("Session does not exist.");
            }
            else if (_sessionRepository.SessionFull(dto.SessionId))
            {
                _logger.LogDebug("Session is full");
                return BadRequest("Session is full.");
            }
            else if (_sessionRepository.GetSessionBySessionId(dto.SessionId).UsernameTaken(dto.Username))
            {
                _logger.LogDebug("Username is taken");
                return BadRequest("Username is taken.");
            }

            var claims = new List<Claim>()
            {
                new Claim(ClaimTypes.NameIdentifier,UIDGenerator.Generate()),
                new Claim(ClaimTypes.Name, dto.Username)
            };

            var identity = new ClaimsIdentity(claims, CookieAuthenticationDefaults.AuthenticationScheme);
            var principal = new ClaimsPrincipal(identity);
            await HttpContext.SignInAsync(CookieAuthenticationDefaults.AuthenticationScheme, principal, new AuthenticationProperties()
            {
                IsPersistent = true,
            });

            return Ok();
        }

        [HttpGet("categories")]
        public async Task<ActionResult> GetCategories()
        {
            _logger.LogTrace($"Called '{ControllerContext.ActionDescriptor.ActionName}' endpoint");

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
            _logger.LogTrace($"Called '{ControllerContext.ActionDescriptor.ActionName}' endpoint");

            List<RulesetDto> rulesets = new();

            foreach (var rule in Enum.GetValues<Rule>())
            {
                var ruleset = Ruleset.Parse(rule);
                rulesets.Add(new RulesetDto(ruleset));
            }

            _logger.LogDebug($"Returning {rulesets.Count} rulesets");
            return Ok(rulesets);
        } 

        [HttpPost("answers")]
        public ActionResult GetAnswers([FromBody] string sessionid)
        {
            _logger.LogTrace($"Called '{ControllerContext.ActionDescriptor.ActionName}' endpoint");

            if (string.IsNullOrEmpty(sessionid))
            {
                _logger.LogDebug("Empty session ID");
                return BadRequest("Empty session ID");
            }
            else if (!_sessionRepository.SessionExists(sessionid))
            {
                _logger.LogDebug("Session does not exist");
                return BadRequest("Session does not exist");
            }
            else if (!_sessionRepository.SessionCompleted(sessionid))
            {
                _logger.LogDebug("Session not completed");
                return BadRequest("Session not completed");
            }

            var session = _sessionRepository.GetSessionBySessionId(sessionid);

            var questions = session.Questions;

            return Ok(questions);
        }

        [HttpGet("session-lifetime")]
        public ActionResult GetSessionLifetime()
        {
            _logger.LogTrace($"Called '{ControllerContext.ActionDescriptor.ActionName}' endpoint");

            return Ok(_parameters.SessionLifetime.TotalMinutes);
        }

        #endregion
    }
}
