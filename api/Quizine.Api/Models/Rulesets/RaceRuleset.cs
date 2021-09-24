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
        private string _currentQuestionId;

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
            var nextQuestion = session.GetNextSessionQuestion(_currentQuestionId, out bool lastQuestion);
            _currentQuestionId = nextQuestion?.ID;

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

        private bool ShouldAdvanceToNextQuestion(IQuizSession session)
        {
            return session.AllUsersAnswered(_currentQuestionId);
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

        public override async Task NextQuestion(QuizHub hub, IQuizSession session)
        {
            QuizItem nextQuestion;

            if (_currentQuestionId == null)
            {
                nextQuestion = session.Questions.First();
                _currentQuestionId = nextQuestion?.ID;
            }
            else
            {
                nextQuestion = session.Questions.Single(x => x.ID == _currentQuestionId);
            }

            bool lastQuestion = nextQuestion == session.Questions.Last();

            await hub.Clients.User(hub.Context.UserIdentifier).NextQuestion(new NextQuestionDto(nextQuestion, lastQuestion));
        }

        public override async Task SubmitAnswer(QuizHub hub, IQuizSession session, string questionId, string answerId)
        {
            await _lock.WaitAsync();

            try
            {
                // Check if answer is correct
                string correctAnswerId = session.SubmitAnswer(hub.Context.UserIdentifier, questionId, answerId, out int points);
                bool isCorrectAnswer = answerId == correctAnswerId;

                // If answer is correct
                if (isCorrectAnswer)
                {
                    // Set blank answers for all other clients
                    foreach (var user in session.GetUsers())
                    {
                        if (user.UserID == hub.Context.UserIdentifier || session.IsAnswerSet(user.UserID, questionId))
                            continue;

                        session.SubmitAnswer(user.UserID, questionId, null, out _);
                    }

                    // Set correct answer for calling client
                    await hub.Clients.Group(session.SessionParameters.SessionID).ValidateAnswer(new ValidateAnswerDto(correctAnswerId, points, session.GetUser(hub.Context.UserIdentifier).Username));
                    
                    // Advance to next question
                    await AdvanceToNextQuestion(hub, session);

                    return;
                }
                // Otherwise, send incorrect answer to user
                else
                {
                    await hub.Clients.User(hub.Context.UserIdentifier).ValidateAnswer(new ValidateAnswerDto(correctAnswerId, points));

                    if (ShouldAdvanceToNextQuestion(session))
                    {
                        // Advance to next question
                        await AdvanceToNextQuestion(hub, session);

                        return;
                    }
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

        public override async Task OnUserRemoved(QuizHub hub, IQuizSession session)
        {
            if (ShouldAdvanceToNextQuestion(session))
            {
                await AdvanceToNextQuestion(hub, session);
            }

            //var currentQuestion = session.GetNextUserQuestion(hub.Context.UserIdentifier, out _);

            //// If all other members have submitted answers, advance to next question
            //if (session.AllUsersAnsweredExcept(currentQuestion.ID, hub.Context.UserIdentifier))
            //{
            //    await AdvanceToNextQuestion(hub, session, currentQuestion.ID);
            //}
        }

        #endregion
    }
}
