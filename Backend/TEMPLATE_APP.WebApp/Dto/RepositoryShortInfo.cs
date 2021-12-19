using System.Linq;
using System.Threading.Tasks;

namespace TEMPLATE_APP.WebApp.Dto
{
    public class RepositoryShortInfo
    {
        public long Id { get; set; }

        public string Name { get; set; }

        public string Language { get; set; }

        public bool IsUsingInTeaching { get; set; }

        public string HtmlUrl { get; set; }
    }
}
