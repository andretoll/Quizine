using Microsoft.AspNetCore.Mvc.ModelBinding;
using Microsoft.Extensions.Logging;
using Quizine.Api.Models;
using System.Linq;
using System.Text.Json;

namespace Quizine.Api.Helpers
{
    /// <summary>
    /// A static helper class for logging complex messages.
    /// </summary>
    public static class LogHelper
    {
        /// <summary>
        /// Log all errors from a <see cref="ModelStateDictionary"/> object.
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="modelState"></param>
        /// <param name="actionName"></param>
        public static void LogModelStateErrors(ILogger logger, ModelStateDictionary modelState, string actionName)
        {
            logger.LogError($"ModelState error during action '{actionName}'");

            foreach (var error in modelState.Values)
            {
                logger.LogError($"Error: {string.Join(',', error.Errors.Select(x => x.ErrorMessage))}");
            }
        }

        /// <summary>
        /// Log all properties of a <see cref="SessionParameters"/> object.
        /// </summary>
        /// <param name="logger"></param>
        /// <param name="parameters"></param>
        public static void LogSessionParameters(ILogger logger, SessionParameters parameters, LogLevel logLevel)
        {
            logger.Log(logLevel, $"Session parameters: {JsonSerializer.Serialize(parameters)}");
        }
    }
}
