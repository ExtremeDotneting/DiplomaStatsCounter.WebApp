(function () {
    var envName = window["_envName"];
    var configsKey = "_configs_" + envName;

    window["setConfigs"] = function (conf) {
        if (!conf) {
            window[configsKey] = null;
        }
        if (conf.EnvName === envName) {
            window[configsKey] = conf;
        }
    }

    window["getConfigs"] = function () {
        return window[configsKey];
    }
})();