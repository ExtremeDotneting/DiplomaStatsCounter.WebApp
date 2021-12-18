import Helpers from "../helpers";
import AppConfigs from "../appConfigsImport/configsImporter";

class HttpClientClass {
  withCredentials = false
  basePath = AppConfigs.ApiUrl
  defaultHeaders = {
    'Accept': 'texthtml,applicationxhtml+xml,applicationxml;q=0.9,imagewebp,imageapng,;q=0.8,applicationsigned-exchange;v=b3;q=0.9',
    'Content-Type': 'application/json',
    'Cache': 'no-cache',
    //'Cookie': "aa=qq"
  };

  constructor() {
  }

  get = (async (url, headers, disableLogsSerialization) => {
    return await this.send("GET", url, null, headers, disableLogsSerialization);
  })
    .Args("string", "object?", "boolean?")
    .Returns("Promise<object?>")

  post = (async (url, requestObj, headers, disableLogsSerialization) => {
    return await this.send("POST", url, requestObj, headers, disableLogsSerialization);
  })
    .Args("string", "object?", "object?", "boolean?")
    .Returns("Promise<object?>")

  put = (async (url, requestObj, headers, disableLogsSerialization) => {
    return await this.send("PUT", url, requestObj, headers, disableLogsSerialization);
  })
    .Args("string", "object?", "object?", "boolean?")
    .Returns("Promise<object?>")

  delete = (async (url, requestObj, headers, disableLogsSerialization) => {
    return await this.send("DELETE", url, requestObj, headers, disableLogsSerialization);
  })
    .Args("string", "object?", "object?", "boolean?")
    .Returns("Promise<object?>")

  async send(method, url, requestObj, headers, disableLogsSerialization) {
    var baseResponse = null;
    var responseText = null;
    var responseObj = null;

    if (!url.startsWith("http")) {
      if (url.startsWith("/"))
        url = this.basePath + url;
      else
        url = this.basePath + "/" + url;
    }

    if (!headers)
      headers = this.defaultHeaders;

    try {
      var request = {
        method: method,
        url: url,
        headers: headers,
        withCredentials: this.withCredentials
      };
      if (requestObj) {
        var requestJson = JSON.stringify(requestObj);
        request.body = requestJson;
      }

      //Send http request
      baseResponse = await this.asyncXMLHttpRequest(request);

      responseText = await baseResponse.response;
      try {
        responseObj = JSON.parse(responseText);
      }
      catch (deserializeEx) {
        responseObj = responseText;
      }

      if (baseResponse.status < 200 || baseResponse.status > 299) {
        throw {
          text: "Response finished with status: " + baseResponse.status + ".",
          baseResponse: baseResponse
        }
      }

      await this._processResponse(baseResponse, responseObj);

      this._writeLogs(method, url, requestObj, baseResponse, responseText, responseObj, disableLogsSerialization);
    }
    catch (ex) {
      this._writeLogs(method, url, requestObj, baseResponse, responseText, responseObj, disableLogsSerialization, ex);
      throw ex;
    }
    return responseObj;
  }

  //Get headers, return headers.
  addDefaultHeaders(headers) {
    var headersWithDefault = {};
    var headerNames = Object.keys(this.defaultHeaders);
    for (var i = 0; i < this.defaultHeaders.length; i++) {
      var headerName = headerNames[i];
      headersWithDefault[headerName] = this.defaultHeaders[headerName];
    }
    if (headers) {
      headerNames = Object.keys(headers);
      for (i = 0; i < headers.length; i++) {
        headerName = headerNames[i];
        headersWithDefault[headerName] = headers[headerName];
      }
    }
    return headersWithDefault;
  }

  async asyncXMLHttpRequest({ method, url, body, headers, withCredentials }) {
    return new Promise(function (resolve, reject) {
      let xhr = new XMLHttpRequest();
      xhr.withCredentials = withCredentials;
      xhr.open(method, url, true);
      var headerNames = Object.keys(headers);
      for (var i = 0; i < headerNames.length; i++) {
        var headerName = headerNames[i];
        xhr.setRequestHeader(headerName, headers[headerName]);
      }
      xhr.onload = function () {
        resolve(xhr);
      };
      xhr.onerror = function () {
        reject(xhr);
      };
      if (body)
        xhr.send(body);
      else
        xhr.send();
    });
  }

  //eslint-disable-next-line
  async _processResponse(xhr, responseObj) {
    //Use this to override processing response.
  }

  _writeLogs(method, url, requestObj, baseResponse, responseText, responseObj, disableLogsSerialization, ex) {
    window["LastResponse"] = baseResponse;
    window["LastResponseError"] = ex;

    //Логируем тип и путь запроса
    if (ex) {
      console.log("-/-> " + method + " " + url);
      //console.log({ ERROR: ex });
    }
    else {
      console.log("---> " + method + " " + url);
    }

    //Логируем запрос и ответ в виде объектов
    if (requestObj != null) {
      console.log({
        request: requestObj,
      });
    }
    if (responseObj != null) {
      console.log({
        response: responseObj
      });
    }

    //Логируем запрос и ответ в виде текста
    if (requestObj != null && AppConfigs.HttpClient.SerializeRequest) {
      console.log("Request:")
      Helpers.logAsJson(requestObj);
    }
    if (responseObj != null && !(disableLogsSerialization === true) && AppConfigs.HttpClient.SerializeResponse) {
      console.log("Response:")
      if (responseObj)
        Helpers.logAsJson(responseObj);
      else
        responseText
    }
  }
}

export default HttpClientClass;