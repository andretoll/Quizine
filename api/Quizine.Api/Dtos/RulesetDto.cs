using Quizine.Api.Models.Base;

namespace Quizine.Api.Dtos
{
    public class RulesetDto
    {
        #region Public Properties

        public string Rule { get; set; }
        public string Description { get; set; }
        public bool EnableTimeout { get; set; }

        #endregion

        #region Constructor

        public RulesetDto(Ruleset ruleset)
        {
            Rule = ruleset.Title;
            Description = ruleset.Description;
            EnableTimeout = ruleset.EnableTimeout;
        }

        #endregion
    }
}
