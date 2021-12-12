import * as AppSettingsModule from '../public/appsettings.json';
var AppSettings = AppSettingsModule.default;
window["AppSettings"] = AppSettings;
export default AppSettings;