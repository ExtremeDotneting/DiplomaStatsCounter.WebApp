import * as AppSettingsModule from '../public/appsettings.json';
var AppSettings = AppSettingsModule.default;

try {
    let xhr = new XMLHttpRequest();
    xhr.withCredentials = true;
    xhr.open("GET", window.location.origin + AppSettings.SettingsPath, false);
    xhr.setRequestHeader('Cache', 'no-cache');
    xhr.send();
    let appSettingsJson = xhr.response;

    AppSettings = JSON.parse(appSettingsJson);
    window["AppSettings"] = AppSettings;
} catch (ex) {
    console.log(ex);
}

export default AppSettings;