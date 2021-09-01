using Quizine.Api.Enums;
using Quizine.Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Quizine.Api.Tests.Utils
{
    public static class TestData
    {
        public static SessionParameters GetRandomSessionParameters()
        {
            Random r = new();

            return new SessionParameters()
            {
                Rule =  (Rule)r.Next(0, Enum.GetNames<Rule>().Length),
                Title = GetRandomString(8),
                PlayerCount = r.Next(1, 8),
                QuestionCount = r.Next(1, 50),
                QuestionTimeout = r.Next(0, 120),
                Category = r.Next(0, 30),
                Difficulty = r.Next(0, 1) > 0 ? "Easy" : "Hard",
                SessionID = GetRandomString(7)
            };
        }

        public static SessionParameters GetRandomSessionParameters(Rule rule)
        {
            Random r = new();

            return new SessionParameters()
            {
                Rule = rule,
                Title = GetRandomString(8),
                PlayerCount = r.Next(1, 8),
                QuestionCount = r.Next(1, 50),
                QuestionTimeout = r.Next(0, 120),
                Category = r.Next(0, 30),
                Difficulty = r.Next(0, 1) > 0 ? "Easy" : "Hard",
                SessionID = GetRandomString(7)
            };
        }

        public static IEnumerable<QuizItem> GetRandomQuizItems(int count)
        {
            List<QuizItem> quizItems = new();

            for (int i = 0; i < count; i++)
            {
                quizItems.Add(
                    new QuizItem(
                        GetRandomString(5),
                        GetRandomString(4),
                        GetRandomString(3),
                        GetRandomString(30),
                        i,
                        GetRandomString(7),
                        new string[] { GetRandomString(8), GetRandomString(9), GetRandomString(10) }
                    ));
            }

            return quizItems;
        }

        public static IEnumerable<QuizProgress> GetRandomQuizProgressList(User[] users, int questionCount)
        {
            Random r = new Random();

            var quizItems = GetRandomQuizItems(questionCount);
            List<QuizProgress> progressList = new List<QuizProgress>();

            for (int i = 0; i < users.Length; i++)
            {
                var progress = new QuizProgress(users[i], quizItems);

                foreach (var result in progress.QuizResults)
                {
                    progress.AddResult(result.Question.ID, r.Next(0, 2) > 0 ? result.Question.Answers.First().ID : result.Question.CorrectAnswer.ID);
                }

                progressList.Add(progress);
            }

            return progressList;
        }

        public static string GetRandomString(int length)
        {
            Random r = new();

            const string chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
            return new string(Enumerable.Repeat(chars, length)
              .Select(s => s[r.Next(s.Length)]).ToArray());
        }
    }
}
