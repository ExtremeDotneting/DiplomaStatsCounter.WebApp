import ApiClient from "./apiClient";
import Helpers from "../../libs/helpers"

let UrlCallbacks =
{
    oauth_result(params) {
        ApiClient.setCredentials(params["accessToken"]);
        console.log("Logined with:");
        console.log(params["accessToken"]);
        Helpers.redirect("/");
    }
}

export default UrlCallbacks;