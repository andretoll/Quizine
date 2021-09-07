namespace Quizine.Api.Dtos
{
    public class RulesetDto
    {
        #region Public Properties

        public string Rule { get; set; }
        public string Description { get; set; }

        #endregion

        #region Constructor

        public RulesetDto(string rule, string description)
        {
            Rule = rule;
            Description = description;
        }

        #endregion
    }
}
