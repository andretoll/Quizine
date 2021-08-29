using Microsoft.AspNetCore.WebUtilities;
using Quizine.Api.Helpers;
using Quizine.Api.Interfaces;
using Quizine.Api.Models;
using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Text.Json;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace Quizine.Api.Services
{
    internal class TriviaItem
    {
        [JsonPropertyName("category")]
        public string Category { get; set; }
        [JsonPropertyName("difficulty")]
        public string Difficulty { get; set; }
        [JsonPropertyName("question")]
        public string Question { get; set; }
        [JsonPropertyName("correct_answer")]
        public string CorrectAnswer { get; set; }
        [JsonPropertyName("type")]
        public string Type { get; set; }
        [JsonPropertyName("incorrect_answers")]
        public string[] IncorrectAnswers { get; set; }
    }

    internal class TriviaItemRoot
    {
        [JsonPropertyName("response_code")]
        public int ResponseCode { get; set; }
        [JsonPropertyName("results")]
        public List<TriviaItem> QuizItems { get; set; }
    }

    public class TriviaRepository : ITriviaRespository
    {
        #region Private Members

        private readonly Uri _baseAddress = new("https://opentdb.com/");
        private readonly HttpClient _httpClient;

        #endregion

        #region Constructor

        public TriviaRepository(HttpClient httpClient)
        {
            _httpClient = httpClient;
        }

        #endregion

        #region Private Methods

        private static string ParseDifficulty(string s)
        {
            if (!string.IsNullOrEmpty(s) & (s.ToLower() == "easy" || s.ToLower() == "medium" || s.ToLower() == "hard"))
                return s.ToLower();

            return null;
        }

        private static string ParseCategory(int i)
        {
            return i > 0 ? i.ToString() : null;
        }

        private static IEnumerable<QuizItem> ParseTrivia(TriviaItemRoot root)
        {
            List<QuizItem> quizItems = new();
            int index = 1;

            foreach (var triviaItem in root.QuizItems)
            {
                var quizItem = new QuizItem(
                    triviaItem.Category, 
                    triviaItem.Difficulty, 
                    triviaItem.Type, 
                    StringDecoder.DecodeHTMLString(triviaItem.Question), 
                    index++, 
                    StringDecoder.DecodeHTMLString(triviaItem.CorrectAnswer),
                    StringDecoder.DecodeHTMLString(triviaItem.IncorrectAnswers));

                quizItems.Add(quizItem);
            }

            return quizItems;
        }

        #endregion

        #region ITriviaRepository Implementation

        public async Task<string> GetCategoriesJsonString()
        {
            var uri = new Uri(_baseAddress, "api_category.php");
            var request = new HttpRequestMessage(HttpMethod.Get, uri);

            var response = await _httpClient.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                var jsonString = await response.Content.ReadAsStringAsync();

                return jsonString;
            }
            else
            {
                return null;
            }
        }

        public async Task<IEnumerable<QuizItem>> GetTrivia(int questionCount, int category, string difficulty)
        {
            var uri = new Uri(_baseAddress, "api.php");
            var queryParams = new Dictionary<string, string>()
            {
                {"amount", questionCount.ToString() },
                {"category", ParseCategory(category) },
                {"difficulty", ParseDifficulty(difficulty) }
            };
            string query = QueryHelpers.AddQueryString(uri.AbsoluteUri, queryParams);
            var request = new HttpRequestMessage(HttpMethod.Get, query);

            var response = await _httpClient.SendAsync(request);

            if (response.IsSuccessStatusCode)
            {
                var jsonString = await response.Content.ReadAsStringAsync();

                var root = JsonSerializer.Deserialize<TriviaItemRoot>(jsonString);

                return ParseTrivia(root);
            }
            else
            {
                return null;
            }
        } 

        #endregion
    }
}
