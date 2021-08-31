﻿using Quizine.Api.Models;
using System.Collections.Generic;
using System.Linq;

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

            results = results.OrderBy(x => x.FinishedTime);

            foreach (var result in results)
            {
                var score = new ScoreDto(result.User.Username, result.Score.GetValueOrDefault());

                Scores.Add(score);
            }

            Scores = Scores.OrderByDescending(x => x.Points).ToList();
        }

        #endregion
    }
}
