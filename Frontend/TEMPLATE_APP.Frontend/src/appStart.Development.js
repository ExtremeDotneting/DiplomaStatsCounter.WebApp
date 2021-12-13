//Define Development only imports.
import KeyValueStorage from "../libs/keyValueStorage.js";
import helpers from "../libs/helpers.js"
import dialogs from "@/js/dialogs";
import tests from "@/js/tests";

import './appStart';

window["KeyValueStorage"]=KeyValueStorage;
window["dialogs"] = dialogs;
window["tests"] = tests;
window["helpers"] = helpers;