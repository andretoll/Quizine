﻿using Quizine.Api.Models;
using Quizine.Api.Models.Base;
using System.Collections.Generic;

namespace Quizine.Api.Interfaces
{
    public interface IQuizSession
    {
        #region Properties

        SessionParameters SessionParameters { get; }
        IEnumerable<QuizProgress> MemberProgressList { get; }
        Ruleset Ruleset { get; }
        bool IsStarted { get; }
        bool IsCompleted { get; }
        int QuestionCount { get;  }
        int MaxScore { get; }

        #endregion

        #region Methods

        void AddUser(string connectionId, string username);
        string RemoveUser(string connectionId);
        IEnumerable<User> GetUsers();
        User GetUser(string connectionId);
        bool UserExists(string connectionId);
        bool UsernameTaken(string username);

        QuizItem GetNextQuestion(string connectionId, out bool lastQuestion);
        string SubmitAnswer(string connectionId, string questionId, string answerId, out int points);
        IEnumerable<QuizProgress> GetResults();

        void Start();

        #endregion
    }
}
