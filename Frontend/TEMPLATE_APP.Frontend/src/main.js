import "../libs/typeChecking/importer.js";
import "../libs/httpClient.js";
import "../libs/appSettings.js";
import KeyValueStorage from "../libs/keyValueStorage.js";
import Vue from 'vue';
import App from '@/App.vue';
import vuetify from '@/plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@mdi/font/css/materialdesignicons.css';
import router from '@/js/router';
import './main.css';
import helpers from "../libs/helpers.js"
import dialogs from "@/js/dialogs";
import tests from "@/js/tests";

function main() {
  try {
    helpers.setZoom(0.7);

    //If development.
    if (window.AppSettings.EnvName === 'Development') {
      window["KeyValueStorage"]=KeyValueStorage;
      window["dialogs"] = dialogs;
      window["tests"] = tests;
      window["helpers"] = helpers;
    }
  } catch (ex) {
    console.error(ex);
  }



  Vue.config.productionTip = false
  window["VueApp"] = new Vue({
    vuetify,
    router,
    render: h => h(App)
  }).$mount('#app');

}
main();