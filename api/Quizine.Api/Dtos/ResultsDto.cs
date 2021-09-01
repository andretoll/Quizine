using Quizine.Api.Models;
using System.Collections.Generic;

namespace Quizine.Api.Dtos
{
    public class ResultsDto
    {
        #region Public Properties

        public List<ScoreDto> Scores { get; }

        #endregion

        #region Constructor

        public ResultsDto(IEnumerable<QuizProgress> results)
        {
            Scores = new List<ScoreDto>();

            foreach (var result in results)
            {
                var score = new ScoreDto(result.User.Username, result.Score.GetValueOrDefault());

                Scores.Add(score);
            }
        }

        #endregion
    }

    public class ScoreDto
    {
        #region Public Properties

        public string Username { get; set; }
        public int Points { get; set; }

        #endregion

        #region Constructor

        public ScoreDto(string username, int points)
        {
            Username = username;
            Points = points;
        }

        #endregion
    }
}
