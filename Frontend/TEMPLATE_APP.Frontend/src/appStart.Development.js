//Define Development only imports.
import KeyValueStorage from "../libs/keyValueStorage.js";
import helpers from "../libs/helpers.js"
import dialogs from "@/js/dialogs";
import '../tests/testsImporter';
import './appStart';

window["KeyValueStorage"]=KeyValueStorage;
window["dialogs"] = dialogs;
window["helpers"] = helpers;