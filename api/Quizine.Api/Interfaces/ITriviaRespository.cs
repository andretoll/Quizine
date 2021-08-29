using Quizine.Api.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Quizine.Api.Interfaces
{
    public interface ITriviaRespository
    {
        #region Methods

        Task<string> GetCategoriesJsonString();
        Task<IEnumerable<QuizItem>> GetTrivia(int questionCount, int category, string difficulty); 

        #endregion
    }
}
