import ApiClient from "./apiClient";

let UrlCallbacks =
{
    oauth_result(params) {
        alert("aa")
        ApiClient.setCredentials(params["accessToken"]);
    }
}

export  default UrlCallbacks;