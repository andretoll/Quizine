using Quizine.Api.Enums;

namespace Quizine.Api.Dtos
{
    public class RulesetDto
    {
        #region Public Properties

        public Rule Rule { get; set; }
        public string Description { get; set; }

        #endregion

        #region Constructor

        public RulesetDto(Rule rule, string description)
        {
            Rule = rule;
            Description = description;
        }

        #endregion
    }
}
