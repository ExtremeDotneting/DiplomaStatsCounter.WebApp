using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IRO.Mvc.CoolSwagger;
using IRO.Storage;
using IROFramework.Core.AppEnvironment;
using IROFramework.Core.AppEnvironment.SettingsDto;
using IROFramework.Core.Models;
using IROFramework.Web.Controllers;
using IROFramework.Web.Dto.FilesStorageDto;
using IROFramework.Web.Services.Auth;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Octokit;
using Telegram.Bot.CloudStorage;
using TEMPLATE_APP.WebApp.Dto;

namespace TEMPLATE_APP.WebApp.Controllers
{
    [ApiController]
    [Authorize]
    [Route(CommonConsts.ApiPath + "/github")]
    public class GithubController : ControllerBase
    {
        readonly IGithubUserAuthService _githubUserAuthService;

        public GithubController(GithubAuthSettings githubAuthSettings, IGithubUserAuthService githubUserAuthService)
        {
            _githubUserAuthService = githubUserAuthService;
        }

        [HttpGet("getMe")]
        public async Task<Octokit.User> GetMe()
        {
            var client = await ResolveMyClient();
            return await client.User.Current();
        }

        [HttpGet("getMyRepositories")]
        public async Task<IEnumerable<RepositoryShortInfo>> GetMyRepositories()
        {
            var client = await ResolveMyClient();
            var repos = await client.Repository.GetAllForCurrent();
            var shortInfoList = repos.Select(r => new RepositoryShortInfo()
            {
                Id = r.Id,
                Name = r.Name
            });
            return shortInfoList;
        }

        [HttpGet("getRepositoryInfo")]
        public async Task<RepositoryDetailedInfo> GetRepositoryInfo(long repositoryId)
        {
            var client = await ResolveMyClient();
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

            var participation=await client.Repository.Statistics.GetParticipation(repositoryId);
            detailedInfo.TotalCommits=participation.TotalCommits();

            var dict = new Dictionary<int, AggregatedStatsDto>();

            var commitActivity = await client.Repository.Statistics.GetCommitActivity(repositoryId);
            var allWeekStatsList = new List<WeekStatistics>();
            var workWeekStatsList = new List<WeekStatistics>();
            var dayStatsList = new List<DayStatistics>();
            foreach (var week in commitActivity.Activity)
            {
                var commintWeekStats = new WeekStatistics()
                {
                    WeekDate = week.WeekTimestamp.UtcDateTime,
                    CommitsCount = week.Total
                };
                allWeekStatsList.Add(commintWeekStats);
                if (commintWeekStats.CommitsCount == 0)
                    continue;

                workWeekStatsList.Add(commintWeekStats);

                for (int i = 0; i < week.Days.Count; i++)
                {
                    var dayCommitsCount = week.Days[i];
                    if (dayCommitsCount == 0)
                        continue;
                    var dayStats = new DayStatistics()
                    {
                        CommitsCount = dayCommitsCount,
                        DayDate = week.WeekTimestamp.UtcDateTime.AddDays(i)
                    };
                    dayStatsList.Add(dayStats);
                }
            }
            detailedInfo.DayCommitStats = dayStatsList;
            detailedInfo.WeekCommitStats_All = allWeekStatsList;
            detailedInfo.WeekCommitStats_Work = workWeekStatsList;

            var codeFrequency=await client.Repository.Statistics.GetCodeFrequency(repositoryId);
            codeFrequency.AdditionsAndDeletionsByWeek;

            return detailedInfo;
        }

        async Task<GitHubClient> ResolveMyClient()
        {
            var user = await this.GetCurrentUser();
            return await _githubUserAuthService.GetUserApiClient(user.Id);
        }
    }

    public class AggregatedStatsDto
    {
    }


    public class WeekStatistics
    {
        public DateTime WeekDate { get; set; }

        public int CommitsCount { get; set; }
    }

    public class DayStatistics
    {
        public DateTime DayDate { get; set; }

        public int CommitsCount { get; set; }
    }

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
        public List<DayStatistics> DayCommitStats { get; set; }
        
        [JsonProperty(Order = 2)]
        public List<WeekStatistics> WeekCommitStats_Work;

        [JsonProperty(Order = 3)]
        public List<WeekStatistics> WeekCommitStats_All;

    }


}
