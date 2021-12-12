using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.Extensions.Logging;
using Octokit;
using TEMPLATE_APP.WebApp.Controllers;
using TEMPLATE_APP.WebApp.Dto;

namespace TEMPLATE_APP.WebApp.Services
{
    public class GithubStatsCounterService
    {
        readonly ILogger _logger;

        public GithubStatsCounterService(ILogger<GithubStatsCounterService> logger)
        {
            _logger = logger;
        }

        public async Task<IEnumerable<RepositoryShortInfo>> GetMyRepositories(GitHubClient client)
        {
            var repos = await client.Repository.GetAllForCurrent();
            var githubUser = await client.User.Current();

            var shortInfoList = repos
                .Where(r => r.Owner.Id == githubUser.Id)
                .Select(r => new RepositoryShortInfo()
                {
                    Id = r.Id,
                    Name = r.Name
                })
                .ToList();

            try
            {
                var userOrganizations = await client.Organization.GetAllForUser(githubUser.Login);
                foreach (var org in userOrganizations)
                {
                    var orgRepos = await client.Repository.GetAllForOrg(org.Login);
                    foreach (var repo in orgRepos)
                    {
                        shortInfoList.Add(new RepositoryShortInfo()
                        {
                            Id = repo.Id,
                            Name = repo.Name
                        });
                    }
                }
            }
            catch(Exception ex)
            {
                _logger.LogError("Error fetching orgs info.", ex);
            }

            return shortInfoList;
        }

        public async Task<RepositoryDetailedInfo> GetRepositoryInfo(GitHubClient client, long repositoryId)
        {
            var repo = await client.Repository.Get(repositoryId);

            var detailedInfo = new RepositoryDetailedInfo();

            detailedInfo.Id = repo.Id;
            detailedInfo.Name = repo.Name;
            detailedInfo.FullName = repo.FullName;
            detailedInfo.CreatedAt = repo.CreatedAt.UtcDateTime;
            detailedInfo.UpdatedAt = repo.UpdatedAt.UtcDateTime;
            detailedInfo.Description = repo.Description;
            detailedInfo.ForksCount = repo.ForksCount;
            detailedInfo.GitUrl = repo.GitUrl;
            detailedInfo.HtmlUrl = repo.HtmlUrl;
            detailedInfo.Language = repo.Language;
            detailedInfo.Size = repo.Size;
            detailedInfo.WatchersCount = repo.WatchersCount;

            detailedInfo.OpenIssuesCount = repo.OpenIssuesCount;
            var issues = await client.Issue.GetAllForRepository(repositoryId);
            detailedInfo.IssuesCount = issues.Count;

            var pullRequests = await client.PullRequest.GetAllForRepository(repositoryId);
            detailedInfo.PullRequestsCount = pullRequests.Count;

            var participation = await client.Repository.Statistics.GetParticipation(repositoryId);
            detailedInfo.TotalCommits = participation.TotalCommits();



            var dict = new Dictionary<int, DayStatistics>();
            var commitActivity = await client.Repository.Statistics.GetCommitActivity(repositoryId);
            foreach (var week in commitActivity.Activity)
            {
                for (int i = 0; i < week.Days.Count; i++)
                {
                    var item = GetItem(dict, week.WeekTimestamp.UtcDateTime, i);
                    item.CommitsCount = week.Days[i];
                }
            }

            var codeFrequency = await client.Repository.Statistics.GetCodeFrequency(repositoryId);
            foreach (var week in codeFrequency.AdditionsAndDeletionsByWeek)
            {
                var additionsDaily = week.Additions / 7;
                var deletionsDaily = week.Deletions / 7;
                var newLinesDaily = (week.Additions + week.Deletions) / 7;

                for (int i = 0; i < 7; i++)
                {
                    var item = GetItem(dict, week.Timestamp.UtcDateTime, i);
                    item.AdditionsLinesCount = additionsDaily;
                    item.DeletionsLinesCount = deletionsDaily;
                    item.NewLinesCount = newLinesDaily;
                }
            }

            var sortedStats = dict
                .Select(r => r.Value)
                .Where(r => r.CommitsCount != 0 || r.NewLinesCount != 0)
                .OrderBy(r => r.DayNumber)
                .ToList();

            var estimatedCommitsPerDay = (int)detailedInfo.TotalCommits / participation.All.Count / 7;
            if (estimatedCommitsPerDay <= 0)
            {
                estimatedCommitsPerDay = 1;
            }

            var totalLines = 0;
            var totalCommits = 0;
            foreach (var item in sortedStats)
            {
                totalLines += item.NewLinesCount;
                item.TotalLinesCount = totalLines;
                if (item.CommitsCount <= 0)
                {
                    item.CommitsCount = estimatedCommitsPerDay;
                }

                totalCommits += item.CommitsCount;
                item.TotalCommitsCount = totalCommits;
            }

            detailedInfo.DayCommitStats = sortedStats;
            return detailedInfo;
        }

        DayStatistics GetItem(Dictionary<int, DayStatistics> dict, DateTime weekDate, int dayNumber)
        {
            var key = (int)(weekDate - DateTime.MinValue).TotalDays + dayNumber;
            if (dict.TryGetValue(key, out var value))
            {
                return value;
            }
            else
            {
                var newItem = new DayStatistics();
                newItem.DayNumber = key;
                newItem.DayDate = weekDate.AddDays(dayNumber);
                dict[key] = newItem;
                return newItem;
            }
        }
    }
}
