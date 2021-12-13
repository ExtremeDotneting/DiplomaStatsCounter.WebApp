import AppConfigs from "../libs/appConfigsImport/configsImporter"

console.log("EnvName = " + AppConfigs.EnvName);

var appModule = require("./appStart." + AppConfigs.EnvName + ".js");

export default appModule;