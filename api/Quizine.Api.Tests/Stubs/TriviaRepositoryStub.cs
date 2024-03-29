﻿using Quizine.Api.Interfaces;
using Quizine.Api.Models;
using Quizine.Api.Tests.Utils;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace Quizine.Api.Tests.Stubs
{
    public class TriviaRepositoryStub : ITriviaRespository
    {
        public Task<string> GetCategoriesJsonString()
        {
            string categories = "{ 'trivia_categories':[{ 'id':9,'name':'General Knowledge'},{ 'id':10,'name':'Entertainment: Books'},{ 'id':11,'name':'Entertainment: Film'},{ 'id':12,'name':'Entertainment: Music'},{ 'id':13,'name':'Entertainment: Musicals & Theatres'},{ 'id':14,'name':'Entertainment: Television'},{ 'id':15,'name':'Entertainment: Video Games'},{ 'id':16,'name':'Entertainment: Board Games'},{ 'id':17,'name':'Science & Nature'},{ 'id':18,'name':'Science: Computers'},{ 'id':19,'name':'Science: Mathematics'},{ 'id':20,'name':'Mythology'},{ 'id':21,'name':'Sports'},{ 'id':22,'name':'Geography'},{ 'id':23,'name':'History'},{ 'id':24,'name':'Politics'},{ 'id':25,'name':'Art'},{ 'id':26,'name':'Celebrities'},{ 'id':27,'name':'Animals'},{ 'id':28,'name':'Vehicles'},{ 'id':29,'name':'Entertainment: Comics'},{ 'id':30,'name':'Science: Gadgets'},{ 'id':31,'name':'Entertainment: Japanese Anime & Manga'},{ 'id':32,'name':'Entertainment: Cartoon & Animations'}]}";
            return Task.FromResult(categories);
        }

        public Task<IEnumerable<QuizItem>> GetTrivia(int questionCount, int category, string difficulty)
        {
            List<QuizItem> quizItems = new();

            for (int i = 0; i < questionCount; i++)
            {
                quizItems.Add(new QuizItem(category.ToString(), difficulty, "type", TestData.GetRandomString(20), i, "correctAnswer", new string[] { "incorrectAnswer" }));
            }

            return Task.FromResult(quizItems as IEnumerable<QuizItem>);
        }
    }
}
