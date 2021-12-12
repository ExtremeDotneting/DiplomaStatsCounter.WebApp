using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IRO.Storage;
using Microsoft.Extensions.Logging;
using Octokit;
using TEMPLATE_APP.WebApp.Controllers;
using TEMPLATE_APP.WebApp.Dto;

namespace TEMPLATE_APP.WebApp.Services
{
    public class GithubStatsCounterService
    {
        readonly ILogger _logger;
        readonly IKeyValueStorage _storage;

        public GithubStatsCounterService(ILogger<GithubStatsCounterService> logger, IKeyValueStorage storage)
        {
            _logger = logger;
            _storage = storage;
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
            catch (Exception ex)
            {
                _logger.LogError("Error fetching orgs info.", ex);
            }

            return shortInfoList;
        }

        public async Task<RepositoryDetailedInfo> GetRepositoryInfo(GitHubClient client, long repositoryId)
        {
            var key = $"repoDetailedInfo_{repositoryId}";
            var detailedInfo=await _storage.GetOrDefault<RepositoryDetailedInfo>(key);
            if (detailedInfo == null)
            {
                detailedInfo = await PrivateGetRepositoryInfo(client,repositoryId);
                await _storage.Set(key, detailedInfo);
                return detailedInfo;
            }
            else
            {
                var t = Task.Run(async () =>
                {
                    var newDetailedInfo = await PrivateGetRepositoryInfo(client, repositoryId);
                    await _storage.Set(key, newDetailedInfo);
                });
                return detailedInfo;
            }
        }

        async Task<RepositoryDetailedInfo> PrivateGetRepositoryInfo(GitHubClient client, long repositoryId)
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

            var dict = new Dictionary<int, WeekStatistics>();
            var codeFrequency = await client.Repository.Statistics.GetCodeFrequency(repositoryId);
            foreach (var week in codeFrequency.AdditionsAndDeletionsByWeek)
            {
                var item = GetItem(dict, week.Timestamp.UtcDateTime);
                item.AdditionsLinesCount = week.Additions;
                item.DeletionsLinesCount = week.Deletions;
                item.NewLinesCount = week.Additions + week.Deletions;

                await FillCommitStatsForWeek(client, repositoryId, item);
            }

            var sortedStats = dict
                .Select(r => r.Value)
                .Where(r => r.CommitsCount != 0 || r.NewLinesCount != 0)
                .OrderBy(r => r.WeekNumber)
                .ToList();

            var totalLines = 0;
            var totalCommits = 0;
            foreach (var item in sortedStats)
            {
                totalLines += item.NewLinesCount;
                item.TotalLinesCount = totalLines;
                totalCommits += item.CommitsCount;
                item.TotalCommitsCount = totalCommits;
            }
            detailedInfo.WeekCommitStats = sortedStats;
            detailedInfo.TotalCommits = sortedStats.Last().TotalCommitsCount;

            return detailedInfo;
        }

        async Task FillCommitStatsForWeek(GitHubClient client, long repositoryId, WeekStatistics item)
        {
            var until = item.WeekDate + TimeSpan.FromMinutes(7 * 24 * 60 - 5);
            var cacheKey = "commitsByDate__" + (until - DateTime.MinValue).Days.ToString();
            IEnumerable<GithubCommitInfo> commitsInfo = await _storage.GetOrDefault<IEnumerable<GithubCommitInfo>>(cacheKey);
            if (commitsInfo == null)
            {
                var gitHubCommits = await client.Repository.Commit.GetAll(repositoryId, new CommitRequest()
                {
                    Since = item.WeekDate,
                    Until = until
                });
                commitsInfo = gitHubCommits
                    .Select(r => new GithubCommitInfo(r));
                await _storage.Set(cacheKey, commitsInfo);
            }

            var uniqUsers = new HashSet<int>();
            var authorsCount = 0;
            foreach (var commit in commitsInfo)
            {
                //var commit = await client.Repository.Commit.Get(repositoryId, commitNotFull.Ref);
                if (!uniqUsers.Contains(commit.AuthorId))
                {
                    authorsCount++;
                    uniqUsers.Add(commit.AuthorId);
                }
            }
            item.AuthorsCount = authorsCount;
            item.CommitsCount = commitsInfo.Count();
        }

        WeekStatistics GetItem(Dictionary<int, WeekStatistics> dict, DateTime weekDate)
        {
            var key = (int)(weekDate - DateTime.MinValue).TotalDays;
            if (dict.TryGetValue(key, out var value))
            {
                return value;
            }
            else
            {
                var newItem = new WeekStatistics();
                newItem.WeekNumber = key;
                newItem.WeekDate = weekDate;
                dict[key] = newItem;
                return newItem;
            }
        }
    }
}
