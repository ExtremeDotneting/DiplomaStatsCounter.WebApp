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
using TEMPLATE_APP.WebApp.Services;

namespace TEMPLATE_APP.WebApp.Controllers
{
    [ApiController]
    [Authorize]
    [Route(CommonConsts.ApiPath + "/github")]
    public class GithubController : ControllerBase
    {
        readonly IGithubUserAuthService _githubUserAuthService;
        readonly GithubStatsCounterService _statsService;

        public GithubController(IGithubUserAuthService githubUserAuthService, GithubStatsCounterService statsService)
        {
            _githubUserAuthService = githubUserAuthService;
            _statsService = statsService;
        }

        [HttpGet("getRepositoryByUrl")]
        public async Task<RepositoryShortInfo> GetRepositoryByUrl([FromQuery]string url)
        {
            url = url
                .Replace("https://github.com/", "")
                .Replace("http://github.com/", "");
            var owner = url.Split("/")[0];
            var name = url.Split("/")[1];
            var client = await ResolveMyClient();
            var repo=await client.Repository.Get(owner, name);
            var shortInfo = new RepositoryShortInfo()
            {
                Id = repo.Id,
                Name = repo.Name
            };
            return shortInfo;
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
            var shortInfoList = await _statsService.GetMyRepositories(client);
            return shortInfoList;
        }

        [HttpGet("getRepositoryInfo")]
        public async Task<RepositoryDetailedInfo> GetRepositoryInfo(long repositoryId)
        {
            var client = await ResolveMyClient();
            var detailedInfo=await _statsService.GetRepositoryInfo(client, repositoryId);
            return detailedInfo;
        }

        async Task<GitHubClient> ResolveMyClient()
        {
            var user = await this.GetCurrentUser();
            return await _githubUserAuthService.GetUserApiClient(user.Id);
        }
    }


   


}
