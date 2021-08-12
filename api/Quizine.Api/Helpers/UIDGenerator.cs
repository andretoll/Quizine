using shortid;
using shortid.Configuration;

namespace Quizine.Api.Helpers
{
    public static class UIDGenerator
    {
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
    }
}
