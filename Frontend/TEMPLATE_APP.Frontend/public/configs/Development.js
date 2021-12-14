setConfigs(
    {
        "EnvName": "Development",
        "ApiUrl": "https://localhost:11621/api",
        "OriginUrl": "http://localhost:8080",
        "DebugEnabled": true,        
        "Auth":{
            "LoginAuthEnabled":false,
            "GithubAuthEnabled":true,
        },
        "HttpClient": {
            "SerializeRequest": false,
            "SerializeResponse": false
        }
    }
);