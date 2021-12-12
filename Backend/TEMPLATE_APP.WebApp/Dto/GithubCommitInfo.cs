using Octokit;

namespace TEMPLATE_APP.WebApp.Dto
{
    public class GithubCommitInfo
    {
        public GithubCommitInfo()
        {
        }

        public GithubCommitInfo(GitHubCommit commit)
        {
            AuthorId=commit?.Author?.Id ?? 1;
            Ref=commit.Ref;
        }

        public string Ref { get; set; }

        public int AuthorId { get; set; }
    }
}