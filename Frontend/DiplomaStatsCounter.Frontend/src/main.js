import TypeChecking from "../libs/typeChecking/typeChecking";
import AppConfigs from "../libs/appConfigsImport/configsImporter"

window["TypeChecking"]=TypeChecking;
console.log("EnvName = " + AppConfigs.EnvName);

var appModule = require("./appStart." + AppConfigs.EnvName + ".js");

export default appModule;