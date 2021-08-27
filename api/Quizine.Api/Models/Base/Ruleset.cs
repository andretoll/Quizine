﻿using Quizine.Api.Enums;
using Quizine.Api.Models.Rulesets;
using System;
using System.Collections.Generic;

namespace Quizine.Api.Models.Base
{
    public abstract class Ruleset
    {
        public abstract string Description { get; }
        
        public abstract int CalculateMaxScore(IEnumerable<QuizItem> questions);
        public abstract int CalculateScore(IEnumerable<QuizResult> results);

        public static Ruleset Parse(Rule rule)
        {
            return rule switch
            {
                Rule.Standard => new StandardRuleset(),
                Rule.Risk => new RiskRuleset(),
                _ => throw new InvalidOperationException("Error while parsing ruleset: Ruleset not supported."),
            };
        }
    }
}
