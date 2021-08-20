using Quizine.Api.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Quizine.Api.Interfaces
{
    public interface IQuizSession
    {
        #region Properties

        SessionParameters SessionParameters { get; }
        bool IsStarted { get; }

        #endregion

        #region Methods

        void AddUser(User name);
        void RemoveUser(string connectionId);
        IEnumerable<User> GetUsers();

        QuizItem GetNextQuestion(string connectionId, out bool lastQuestion);
        string SubmitAnswer(string connectionId, string questionId, string answerId);
        IEnumerable<QuizProgress> GetResults(out bool sessionCompleted);

        void Start();

        #endregion
    }
}
