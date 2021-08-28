using System.Linq;
using System.Web;

namespace Quizine.Api.Helpers
{
    public class StringDecoder
    {
        public static string DecodeHTMLString(string s)
        {
            return HttpUtility.HtmlDecode(s);
        }

        public static string[] DecodeHTMLString(string[] array)
        {
            for (int i = 0; i < array.Length; i++)
            {
                array[i] = HttpUtility.HtmlDecode(array[i]);
            }

            return array;
        }
    }
}
