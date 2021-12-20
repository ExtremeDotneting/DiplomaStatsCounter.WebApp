using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IRO.Storage;
using IROFramework.Core.Models;
using IROFramework.Core.Tools.AbstractDatabase;
using Microsoft.Extensions.Logging;
using Octokit;
using TEMPLATE_APP.WebApp.Controllers;
using TEMPLATE_APP.WebApp.Dto;
using TEMPLATE_APP.WebApp.Models;

namespace TEMPLATE_APP.WebApp.Services
{
    public class GithubStatsCounterService
    {
        readonly ILogger _logger;
        readonly IKeyValueStorage _storage;
        readonly IDatabaseSet<RepositoryModel, string> _repositoryDbSet;

        public GithubStatsCounterService(ILogger<GithubStatsCounterService> logger, IKeyValueStorage storage, IAbstractDatabase db)
        {
            _repositoryDbSet = db.GetDbSet<RepositoryModel, string>();
            _logger = logger;
            _storage = storage;
        }

        public async Task<IEnumerable<RepositoryShortInfo>> GetMyRepositories(GitHubClient client, UserModel currentUser)
        {
            var repos = await client.Repository.GetAllForCurrent();
            var githubUser = await client.User.Current();

            var shortInfoList = repos
                .Where(r => r.Owner.Id == githubUser.Id)
                .Select(r => new RepositoryShortInfo()
                {
                    Id = r.Id,
                    Name = r.Name,
                    Language = r.Language ?? "Unknown",
                    HtmlUrl = r.HtmlUrl
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
                            Name = repo.Name,
                            Language = repo.Language ?? "Unknown",
                            HtmlUrl = repo.HtmlUrl
                        });
                    }
                }
            }
            catch (Exception ex)
            {
                _logger.LogError("Error fetching orgs info.", ex);
            }

            foreach (var repo in shortInfoList)
            {
                var dbId = RepositoryModel.BuildId(currentUser.Id, repo.Id);
                var repoFromDb = await _repositoryDbSet.TryGetByIdAsync(dbId);
                repo.IsUsingInTeaching = repoFromDb?.IsUsingInTeaching == true;
            }

            return shortInfoList;
        }

        public async Task<IEnumerable<RepositoryShortInfo>> GetRepositoriesUsedInTeaching(GitHubClient client, UserModel currentUser)
        {
            var reposFromDb = await _repositoryDbSet.GetByPropertyAsync(r=>r.OwnerUserId, currentUser.Id);
            reposFromDb = reposFromDb.Where(r => r.IsUsingInTeaching);
            var reposShortInfo = new List<RepositoryShortInfo>();
            foreach (var repoFromDb in reposFromDb)
            {
                try
                {
                    var repoGithub = await client.Repository.Get(repoFromDb.GithubId);
                    var shortInfo = new RepositoryShortInfo()
                    {
                        Id = repoGithub.Id,
                        HtmlUrl = repoGithub.HtmlUrl,
                        Language = repoGithub.Language,
                        Name = repoGithub.Name,
                        IsUsingInTeaching = repoFromDb.IsUsingInTeaching
                    };
                    reposShortInfo.Add(shortInfo);
                }
                catch
                {

                }
            }
            return reposShortInfo;
        }

        public async Task<RepositoryModel> SetUseInTeaching(long repositoryId, UserModel currentUser, bool value)
        {
            var dbId = RepositoryModel.BuildId(currentUser.Id, repositoryId);
            await _repositoryDbSet.UpdateAsync(new RepositoryModel()
            {
                GithubId = repositoryId,
                OwnerUserId = currentUser.Id,
                IsUsingInTeaching = value
            });
            return await _repositoryDbSet.GetByIdAsync(dbId);
        }

        public async Task<RepositoryShortInfo> GetRepositoryByUrl(GitHubClient client, string url,
            UserModel currentUser)
        {
            url = url
                .Replace("https://github.com/", "")
                .Replace("http://github.com/", "");
            var owner = url.Split("/")[0];
            var name = url.Split("/")[1];
            var repo = await client.Repository.Get(owner, name);
            var dbId = RepositoryModel.BuildId(currentUser.Id, repo.Id);
            var repoFromDb = await _repositoryDbSet.TryGetByIdAsync(dbId);

            var shortInfo = new RepositoryShortInfo()
            {
                Id = repo.Id,
                Name = repo.Name,
                Language = repo.Language,
                IsUsingInTeaching = repoFromDb?.IsUsingInTeaching == true
            };
            return shortInfo;
        }

        public async Task<RepositoryDetailedInfo> GetRepositoryInfo(GitHubClient client, long repositoryId, UserModel currentUser)
        {
            var key = $"repoDetailedInfo_{repositoryId}";
            var detailedInfo = await _storage.GetOrDefault<RepositoryDetailedInfo>(key);
            if (detailedInfo == null)
            {
                detailedInfo = await PrivateGetRepositoryInfo(client, repositoryId);
                await _storage.Set(key, detailedInfo);
            }
            else
            {
                var t = Task.Run(async () =>
                {
                    var newDetailedInfo = await PrivateGetRepositoryInfo(client, repositoryId);
                    await _storage.Set(key, newDetailedInfo);
                });
            }


            var dbId = RepositoryModel.BuildId(currentUser.Id, repositoryId);
            var repoFromDb = await _repositoryDbSet.TryGetByIdAsync(dbId);
            detailedInfo.IsUsingInTeaching = repoFromDb?.IsUsingInTeaching == true;
            return detailedInfo;
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

            long totalLines = 0;
            long totalCommits = 0;
            long totalAdditionsLinesCount = 0;
            long totalDeletionsLinesCount = 0;
            long totalNewLinesCount = 0;
            long totalAuthorsCount = 0;
            foreach (var item in sortedStats)
            {
                totalLines += item.NewLinesCount;
                item.TotalLinesCount = totalLines;
                totalCommits += item.CommitsCount;
                item.TotalCommitsCount = totalCommits;

                totalAdditionsLinesCount += item.AdditionsLinesCount;
                totalDeletionsLinesCount += item.DeletionsLinesCount;
                totalNewLinesCount += item.NewLinesCount;
                totalAuthorsCount += item.AuthorsCount;
            }
            long averageAdditionsLinesCount = totalAdditionsLinesCount / sortedStats.Count;
            long averageDeletionsLinesCount = totalDeletionsLinesCount / sortedStats.Count;
            long averageNewLinesCount = totalNewLinesCount / sortedStats.Count;
            long averageAuthorsCount = totalAuthorsCount / sortedStats.Count;
            long averageCommitsCount = totalCommits / sortedStats.Count;

            detailedInfo.TotalAdditionsLinesCount = totalAdditionsLinesCount;
            detailedInfo.TotalDeletionsLinesCount = totalDeletionsLinesCount;
            detailedInfo.TotalNewLinesCount = totalNewLinesCount;
            detailedInfo.AverageAdditionsLinesCount = averageAdditionsLinesCount;
            detailedInfo.AverageDeletionsLinesCount = averageDeletionsLinesCount;
            detailedInfo.AverageNewLinesCount = averageNewLinesCount;
            detailedInfo.AverageAuthorsCount = averageAuthorsCount;
            detailedInfo.AverageCommitsCount = averageCommitsCount;
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
