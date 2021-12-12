import * as AppSettingsModule from '../public/appsettings.json';
import Vue from 'vue';
import App from '@/App.vue';
import vuetify from '@/plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@mdi/font/css/materialdesignicons.css';
import router from '@/js/router';
import './main.css';
import helpers from "@/js/base/helpers";
import dialogs from "@/js/base/dialogs";
import tests from "@/js/tests";

function main() {
  try {
    window["AppSettings"] = AppSettingsModule.default;

    helpers.setZoom(0.7);

    //If development.
    if (window.AppSettings.EnvName === 'Development') {
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