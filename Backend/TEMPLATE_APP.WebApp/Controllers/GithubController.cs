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
using TEMPLATE_APP.WebApp.Models;
using TEMPLATE_APP.WebApp.Services;

namespace TEMPLATE_APP.WebApp.Controllers
{
    [ApiController]
    [Authorize]
    [SwaggerTagName("Github")]
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

        [HttpPost("setUseInTeaching")]
        public async Task<RepositoryModel> SetUseInTeaching([FromBody] SetUseInTeachingRequest req)
        {
            var currentUser = await this.GetCurrentUser();
            var model = await _statsService.SetUseInTeaching(req.RepositoryId, currentUser, req.Value);
            return model;
        }

        [HttpGet("getRepositoryByUrl")]
        public async Task<RepositoryShortInfo> GetRepositoryByUrl([FromQuery] string url)
        {
            var client = await ResolveMyClient();
            var currentUser = await this.GetCurrentUser();
            var shortInfo = await _statsService.GetRepositoryByUrl(client, url, currentUser);
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
            var currentUser = await this.GetCurrentUser();
            var shortInfoList = await _statsService.GetMyRepositories(client, currentUser);
            return shortInfoList;
        }

        [HttpGet("getRepositoryInfo")]
        public async Task<RepositoryDetailedInfo> GetRepositoryInfo(long repositoryId)
        {
            var client = await ResolveMyClient();
            var currentUser = await this.GetCurrentUser();
            var detailedInfo = await _statsService.GetRepositoryInfo(client, repositoryId, currentUser);
            return detailedInfo;
        }

        async Task<GitHubClient> ResolveMyClient()
        {
            var user = await this.GetCurrentUser();
            return await _githubUserAuthService.GetUserApiClient(user.Id);
        }
    }





}
