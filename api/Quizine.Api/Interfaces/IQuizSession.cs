using Quizine.Api.Models;
using Quizine.Api.Models.Base;
using System;
using System.Collections.Generic;

namespace Quizine.Api.Interfaces
{
    public interface IQuizSession
    {
        #region Properties

        SessionParameters SessionParameters { get; }
        IEnumerable<QuizProgress> MemberProgressList { get; }
        IEnumerable<QuizItem> Questions { get; }
        DateTime Created { get; }
        Ruleset Ruleset { get; }
        bool IsStarted { get; }
        bool IsCompleted { get; }
        int QuestionCount { get;  }
        int MaxScore { get; }

        #endregion

        #region Methods

        void AddUser(string userId, string username);
        string RemoveUser(string userId);
        IEnumerable<User> GetUsers();
        User GetUser(string userId);
        bool UserExists(string userId);
        bool UsernameTaken(string username);
        bool UserCompleted(string userId);

        QuizItem GetNextUserQuestion(string userId, out bool lastQuestion);
        QuizItem GetNextSessionQuestion(string previousQuestionId, out bool lastQuestion);
        string SubmitAnswer(string userId, string questionId, string answerId, out int points);
        IEnumerable<QuizProgress> GetResults();
        bool IsAnswerSet(string userId, string questionId);
        bool AllUsersAnswered(string questionId);

        void Start();

        #endregion
    }
}
