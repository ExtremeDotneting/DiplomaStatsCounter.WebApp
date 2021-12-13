import AppSettings from '../libs/appSettingsImporter.js';

var appModule = require("./appStart." + AppSettings.EnvName + ".js");

export default appModule;