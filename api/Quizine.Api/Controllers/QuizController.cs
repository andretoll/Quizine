using Microsoft.AspNetCore.Mvc;
using Quizine.Api.Helpers;
using Quizine.Api.Interfaces;
using Quizine.Api.Models;
using System.Text.Json;
using System.Threading.Tasks;

namespace Quizine.Api.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class QuizController : ControllerBase
    {
        private readonly ISessionRepository _sessionRepository;

        public QuizController(ISessionRepository sessionRepository)
        {
            _sessionRepository = sessionRepository;
        }

        [HttpPost("create")]
        public async Task<ActionResult> Post([FromBody]SessionParameters parameters)
        {
            string sessionId = UIDGenerator.Generate();
            parameters.SessionID = sessionId;
            _sessionRepository.AddSession(parameters);

            return Ok(JsonSerializer.Serialize(sessionId));
        }
    }
}
