using NUnit.Framework;

namespace Quizine.Api.Tests
{
    [TestFixture]
    public class Tests
    {
        [Test]
        public void Test()
        {
            string s = "test";
            Assert.IsTrue(string.IsNullOrEmpty(s));
        }
    }
}