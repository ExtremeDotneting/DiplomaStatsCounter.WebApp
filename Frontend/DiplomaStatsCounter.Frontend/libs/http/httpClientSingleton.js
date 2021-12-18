import HttpClientClass from "./httpClient";
const HttpClient = new HttpClientClass();
window["HttpClient"] = HttpClient;
export default HttpClient;