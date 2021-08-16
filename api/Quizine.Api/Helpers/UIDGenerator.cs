using shortid;
using shortid.Configuration;

namespace Quizine.Api.Helpers
{
    /// <summary>
    /// Static helper class for generating UIDs.
    /// </summary>
    public static class UIDGenerator
    {
        #region Public Static Methods

        public static string Generate()
        {
            var options = new GenerationOptions
            {
                Length = 8,
                UseNumbers = false,
                UseSpecialCharacters = false
            };

            return ShortId.Generate(options);
        } 

        #endregion
    }
}
