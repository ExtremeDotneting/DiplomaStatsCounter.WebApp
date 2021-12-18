//Define Development only imports.
import KeyValueStorage from "../libs/keyValueStorage.js";
import Helpers from "../libs/helpers.js"
import VueHelpers from "../libs/vueHelpers.js";
import dialogs from "@/js/dialogs";
import ApiClient from "./js/apiClient.js";
import '../tests/testsImporter';
import './appStart';

window["KeyValueStorage"] = KeyValueStorage;
window["dialogs"] = dialogs;
window["Helpers"] = Helpers;
window["ApiClient"] = ApiClient;
window["VueHelpers"] = VueHelpers;