//Define Development only imports.
import KeyValueStorage from "../libs/keyValueStorage.js";
import Helpers from "../libs/helpers.js"
import VueHelpers from "../libs/vueHelpers.js";
import dialogs from "@/js/dialogs";
import ApiClient from "./js/apiClient.js";
import Consts from "./js/consts.js";
import router from "./js/router";
import '../tests/testsImporter';
import './appStart';

window["router"] = router;
window["Consts"] = Consts;
window["KeyValueStorage"] = KeyValueStorage;
window["dialogs"] = dialogs;
window["Helpers"] = Helpers;
window["ApiClient"] = ApiClient;
window["VueHelpers"] = VueHelpers;