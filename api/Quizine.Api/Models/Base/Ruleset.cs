using Quizine.Api.Enums;
using Quizine.Api.Models.Rulesets;
using System;
using System.Collections.Generic;

namespace Quizine.Api.Models.Base
{
    public abstract class Ruleset
    {
        #region Public Abstract Properties

        public abstract bool EnableSkip { get; }
        public abstract string Description { get; }

        #endregion

        #region Public Virtual Properties

        public virtual int PointsFactor => 100;

        #endregion

        #region Public Abstract Methods

        public abstract int CalculateMaxScore(IEnumerable<QuizItem> questions);
        public abstract int CalculateScore(IEnumerable<QuizResult> results);

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
                _ => throw new InvalidOperationException("Error while parsing ruleset: Ruleset not supported."),
            };
        } 

        #endregion
    }
}
