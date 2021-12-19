using IRO.Mvc.CoolSwagger;
using IROFramework.Core.AppEnvironment;
using IROFramework.Core.Tools.AbstractDatabase;
using IROFramework.Web.Controllers.Crud;
using Microsoft.AspNetCore.Mvc;
using TEMPLATE_APP.WebApp.Models;

namespace TEMPLATE_APP.WebApp.Controllers
{
    [ApiController]
    [Route(CommonConsts.ApiPath + "/github/repository")]
    [SwaggerTagName("Github")]
    public class RepositoryCrudController : BaseCrudController<RepositoryModel, string>
    {
        public RepositoryCrudController(IAbstractDatabase db) : base(db)
        {
        }
    }
}