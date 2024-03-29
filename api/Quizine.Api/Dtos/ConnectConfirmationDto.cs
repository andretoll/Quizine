﻿using Quizine.Api.Enums;
using Quizine.Api.Interfaces;
using System.Linq;

namespace Quizine.Api.Dtos
{
    public class ConnectConfirmationDto
    {
        #region Public Properties

        public bool Connected { get; private set; }
        public int ExpectedUsers { get; private set; }
        public string QuizTitle { get; private set; }
        public string[] Users { get; private set; }
        public string ErrorMessage { get; private set; }
        public int QuestionTimeout { get; private set; }
        public int QuestionCount { get; private set; }
        public int MaxScore { get; private set; }
        public bool EnableSkip { get; private set; }
        public RulesetDto Rule { get; private set; }
        public string Category { get; private set; }
        public string Difficulty { get; private set; }
        public PlayerState State { get; private set; }

        #endregion

        #region Public Methods

        public ConnectConfirmationDto ForceState(PlayerState state)
        {
            State = state;

            return this;
        }

        #endregion

        #region Public Static Methods

        /// <summary>
        /// Creates empty instance with only an error message.
        /// </summary>
        /// <param name="errorMessage"></param>
        /// <returns></returns>
        public static ConnectConfirmationDto CreateErrorResponse(string errorMessage)
        {
            return new ConnectConfirmationDto { ErrorMessage = errorMessage };
        }

        /// <summary>
        /// Creates instance based on an <see cref="IQuizSession"/> object.
        /// </summary>
        /// <param name="session"></param>
        /// <returns></returns>
        public static ConnectConfirmationDto CreateSuccessResponse(IQuizSession session)
        {
            return new ConnectConfirmationDto
            {
                Connected = true,
                QuizTitle = session.SessionParameters.Title,
                ExpectedUsers = session.SessionParameters.PlayerCount,
                Users = session.GetUsers().Select(x => x.Username).ToArray(),
                QuestionTimeout = session.SessionParameters.QuestionTimeout,
                QuestionCount = session.QuestionCount,
                MaxScore = session.MaxScore,
                EnableSkip = session.Ruleset.EnableSkip,
                Rule = new RulesetDto(session.Ruleset),
                Category = session.SessionParameters.CategoryName,
                Difficulty = session.SessionParameters.Difficulty,
            };
        } 

        #endregion
    }
}
