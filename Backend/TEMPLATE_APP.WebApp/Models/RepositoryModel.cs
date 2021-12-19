using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using IROFramework.Core.Tools.AbstractDatabase;

namespace TEMPLATE_APP.WebApp.Models
{
    public class RepositoryModel : IBaseModel<string>
    {
        public string Id
        {
            get => BuildId(OwnerUserId, GithubId);
            set { }
        }

        public long GithubId { get; set; }

        public Guid OwnerUserId { get; set; }

        public bool IsUsingInTeaching { get; set; }

        public static string BuildId(Guid ownerUserId, long githubId)
        {
            return ownerUserId.ToString() + "_" + githubId;
        }
    }
}
