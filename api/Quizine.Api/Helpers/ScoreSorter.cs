using Quizine.Api.Enums;
using Quizine.Api.Models;
using System;
using System.Collections.Generic;
using System.Linq;

namespace Quizine.Api.Helpers
{
    /// <summary>
    /// A static helper class for sorting players according to score.
    /// </summary>
    public static class ScoreSorter
    {
        public static IEnumerable<QuizProgress> Sort(IEnumerable<QuizProgress> list, ScoreSortType sortType)
        {
            return sortType switch
            {
                ScoreSortType.ScoreDescending => list.OrderBy(x => x.FinishedTime).OrderByDescending(x => x.Score),
                _ => throw new NotSupportedException("Sort type not supported."),
            };
        }
    }
}
