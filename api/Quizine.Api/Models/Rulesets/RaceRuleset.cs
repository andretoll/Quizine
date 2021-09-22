using Quizine.Api.Dtos;
using Quizine.Api.Hubs;
using Quizine.Api.Interfaces;
using Quizine.Api.Models.Base;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;

namespace Quizine.Api.Models.Rulesets
{
    public class RaceRuleset : Ruleset
    {
        #region Private Members

        private readonly SemaphoreSlim _lock = new(1, 1);

        #endregion

        #region Public Properties

        public override bool EnableSkip => false;

        public override string Description => "First one to answer the question gets the point. No pressure!";

        public override string Title => "Race";

        public override int? NextQuestionDelay => 5;

        public override bool EnableTimeout => false;

        #endregion

        #region Private Methods

        /// <summary>
        /// A helper method for advancing clients to the next question or results.
        /// </summary>
        /// <param name="hub"></param>
        /// <param name="session"></param>
        /// <returns></returns>
        private async Task AdvanceToNextQuestion(QuizHub hub, IQuizSession session)
        {
            var nextQuestion = session.GetNextQuestion(hub.Context.UserIdentifier, out bool lastQuestion);

            await hub.Clients.Group(session.SessionParameters.SessionID).NextQuestionIncoming(NextQuestionDelay.Value);
            await Task.Delay(TimeSpan.FromSeconds(NextQuestionDelay.Value));
            
            // If previous question was the last
            if (nextQuestion == null)
            {
                // Force clients to transition to results page
                await hub.Clients.Group(session.SessionParameters.SessionID).TriggerResults();
            }
            else
            {
                // Advance to next question
                await hub.Clients.Group(session.SessionParameters.SessionID).NextQuestion(new NextQuestionDto(nextQuestion, lastQuestion));
            }
        }

        #endregion

        #region Public Methods

        public override int CalculateMaxScore(IEnumerable<QuizItem> questions)
        {
            return questions.Count() * PointsFactor;
        }

        public override int CalculateScore(IEnumerable<QuizResult> results)
        {
            return results.Where(x => x.IsAnswerCorrect).Count() * PointsFactor;
        }

        public override int GetQuestionPoints(QuizResult result)
        {
            return result != null && result.IsAnswerCorrect ? PointsFactor : 0;
        }

        public override async Task SubmitAnswer(QuizHub hub, IQuizSession session, string questionId, string answerId)
        {
            await _lock.WaitAsync();

            try
            {
                bool firstToAnswerCorrectly = session.IsFirstToAnswerCorrectly(questionId);
                string correctAnswerId = session.SubmitAnswer(hub.Context.UserIdentifier, questionId, answerId, out int points);
                bool isCorrectAnswer = answerId == correctAnswerId;

                // If answer is correct and first
                if (isCorrectAnswer && firstToAnswerCorrectly)
                {
                    // Set blank answers for all other clients
                    foreach (var user in session.GetUsers())
                    {
                        if (user.UserID == hub.Context.UserIdentifier || session.IsAnswerSet(user.UserID, questionId))
                            continue;

                        session.SubmitAnswer(user.UserID, questionId, null, out _);
                    }

                    // Set correct answer for calling client and advance to next question
                    await hub.Clients.Group(session.SessionParameters.SessionID).ValidateAnswer(new ValidateAnswerDto(correctAnswerId, points, session.GetUser(hub.Context.UserIdentifier).Username));
                    await AdvanceToNextQuestion(hub, session);
                    return;
                }
                // Otherwise, send answer to user
                else
                {
                    await hub.Clients.User(hub.Context.UserIdentifier).ValidateAnswer(new ValidateAnswerDto(correctAnswerId, points));
                }

                // If all members have submitted answers, advance to next question
                if (session.AllUsersAnswered(questionId))
                {
                    await AdvanceToNextQuestion(hub, session);
                    return;
                }
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                _lock.Release();
            }
        }

        #endregion
    }
}
