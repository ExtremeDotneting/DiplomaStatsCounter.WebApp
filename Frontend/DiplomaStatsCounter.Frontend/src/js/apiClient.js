import HttpClientClass from "../../libs/http/httpClient";
import AppConfigs from "../../libs/appConfigsImport/configsImporter";
import KeyValueStorage from "../../libs/keyValueStorage";
import Consts from "./consts";

class ApiClientClass extends HttpClientClass {
    _userCachedValue = null
    accessToken = null

    constructor() {
        super();
        this.basePath = AppConfigs.ApiUrl;
        this.setCredentials(
            KeyValueStorage.tryGet("API_ACCESS_TOKEN")
        )
    }

    setCredentials(accessToken) {
        this.accessToken = accessToken;
        this.defaultHeaders["Authorization"] = "Bearer " + accessToken;
        KeyValueStorage.set("API_ACCESS_TOKEN", accessToken);
        this._userCachedValue = null;
    }

    async isLogined() {
        try {
            var user = await this.getMe();
            if (user.nickname)
                return true;
            else
                return false;
        } catch (ex) {
            return false;
        }
    }

    getGithubOAuthUrl() {
        var callbackUrl = AppConfigs.OriginUrl + "/" + Consts.CallbackMethodOAuthPath;
        callbackUrl = encodeURI(callbackUrl);
        var url = this.basePath + "/auth/github/login?redirectUrl=" + callbackUrl;
        return url;
    }

    async loginByNickname(nickname, password) {
        var req = { nickname, password };
        var authResult = await this.post("auth/loginByNickname", req);
        this.setCredentials(authResult.accessToken);
        return authResult;
    }

    async logout() {
        try {
            await this.post("auth/logout", {});
            //eslint-disable-next-line
        } catch (ex) { }
        this.setCredentials(null);
    }

    async getMe() {
        if (this._userCachedValue) {
            return this._userCachedValue;
        }
        var user = await this.get("auth/getMe");
        this._userCachedValue = user;
        return user;
    }
}

let ApiClient = new ApiClientClass();

export default ApiClient;