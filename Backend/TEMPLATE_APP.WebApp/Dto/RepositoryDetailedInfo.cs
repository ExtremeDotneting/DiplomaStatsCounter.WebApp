using System;
using System.Collections.Generic;
using Newtonsoft.Json;

namespace TEMPLATE_APP.WebApp.Dto
{
    public class RepositoryDetailedInfo
    {
        public long Id { get; set; }

        public string Name { get; set; }

        public string FullName { get; set; }

        public DateTime CreatedAt { get; set; }

        public DateTime UpdatedAt { get; set; }

        public string Description { get; set; }

        public int ForksCount { get; set; }

        public string GitUrl { get; set; }

        public string HtmlUrl { get; set; }

        public string Language { get; set; }

        public int OpenIssuesCount { get; set; }

        public int IssuesCount { get; set; }

        public long Size { get; set; }

        public int WatchersCount { get; set; }

        public int PullRequestsCount { get; set; }

        public int TotalCommits { get; set; }

        [JsonProperty(Order = 1)] 
        public List<WeekStatistics> WeekCommitStats { get; set; }

    }
}