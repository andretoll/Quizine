using System.Web;

namespace Quizine.Api.Helpers
{
    /// <summary>
    /// A static helper class with members related to decoding HTML content.
    /// </summary>
    public class StringDecoder
    {
        #region Public Static Methods

        /// <summary>
        /// Decodes a single HTML string.
        /// </summary>
        /// <param name="s"></param>
        /// <returns></returns>
        public static string DecodeHTMLString(string s)
        {
            return HttpUtility.HtmlDecode(s);
        }

        /// <summary>
        /// Decodes an array of HTML strings.
        /// </summary>
        /// <param name="array"></param>
        /// <returns></returns>
        public static string[] DecodeHTMLString(string[] array)
        {
            for (int i = 0; i < array.Length; i++)
            {
                array[i] = HttpUtility.HtmlDecode(array[i]);
            }

            return array;
        } 

        #endregion
    }
}
