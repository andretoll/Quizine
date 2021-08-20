using Quizine.Api.Enums;
using Quizine.Api.Models;
using System.Collections.Generic;
using System.Linq;

namespace Quizine.Api.Dtos
{
    public class ResultsDto
    {
        #region Public Properties

        public bool SessionCompleted { get; }
        public List<ScoreDto> Scores { get; set; }

        #endregion

        #region Constructor

        public ResultsDto(IEnumerable<QuizProgress> results, bool sessionCompleted, Rule rule)
        {
            SessionCompleted = sessionCompleted;

            Scores = new List<ScoreDto>();

            foreach (var result in results)
            {
                var score = new ScoreDto(result.User.Username, result.CalculatePoints(rule));

                Scores.Add(score);
            }

            Scores = Scores.OrderByDescending(x => x.Points).ToList();
        }

        #endregion
    }
}
