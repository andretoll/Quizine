using Quizine.Api.Dtos;
using Quizine.Api.Enums;
using Quizine.Api.Hubs;
using Quizine.Api.Interfaces;
using Quizine.Api.Models.Rulesets;
using System;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Quizine.Api.Models.Base
{
    public abstract class Ruleset
    {
        #region Public Abstract Properties

        public abstract bool EnableSkip { get; }
        public abstract string Description { get; }
        public abstract string Title { get; }

        #endregion

        #region Public Virtual Properties

        public virtual int PointsFactor => 100;
        public virtual int? NextQuestionDelay => null;
        public virtual bool EnableTimeout => true;

        #endregion

        #region Public Abstract Methods

        public abstract int CalculateMaxScore(IEnumerable<QuizItem> questions);
        public abstract int CalculateScore(IEnumerable<QuizResult> results);
        public abstract int GetQuestionPoints(QuizResult result);

        #endregion

        #region Public Virtual Methods

        public virtual async Task SubmitAnswer(QuizHub hub, IQuizSession session, string questionId, string answerId) 
        {
            string correctAnswerId = session.SubmitAnswer(hub.Context.ConnectionId, questionId, answerId, out int points);
            await hub.Clients.Caller.ValidateAnswer(new ValidateAnswerDto(correctAnswerId, points));
        }

        public virtual async Task NextQuestion(QuizHub hub, IQuizSession session)
        {
            var nextQuestion = session.GetNextQuestion(hub.Context.ConnectionId, out bool lastQuestion);
            await hub.Clients.Caller.NextQuestion(new NextQuestionDto(nextQuestion, lastQuestion));
        }

        public virtual async Task GetResults(QuizHub hub, IQuizSession session)
        {
            var results = session.GetResults();

            await hub.Clients.Group(session.SessionParameters.SessionID).Results(new ResultsDto(results));

            // Notify users if quiz is completed
            if (session.IsCompleted)
            {
                await hub.Clients.Group(session.SessionParameters.SessionID).QuizCompleted();
            }
        }

        #endregion

        #region Public Static Methods

        /// <summary>
        /// Parses a <see cref="Rule"/> into a <see cref="Ruleset"/>.
        /// </summary>
        /// <param name="rule"></param>
        /// <returns></returns>
        public static Ruleset Parse(Rule rule)
        {
            return rule switch
            {
                Rule.Standard => new StandardRuleset(),
                Rule.Risk => new RiskRuleset(),
                Rule.Balanced => new BalancedRuleset(),
                Rule.Race => new RaceRuleset(),
                _ => throw new InvalidOperationException("Error while parsing ruleset: Ruleset not supported."),
            };
        } 

        #endregion
    }
}
