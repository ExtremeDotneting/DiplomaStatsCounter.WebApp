import Vue from 'vue';
import App from '@/App.vue';
import vuetify from '@/plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@mdi/font/css/materialdesignicons.css';
import router from '@/js/router';
import './main.css';
import Helpers from "@/js/Helpers";
import Dialogs from "@/js/Dialogs";
import Tests from "@/js/Tests";
import {
  BridgeMain, TabletopHelperSite
} from "@/js/bridgeDotNetImporter";

function main() {
  try {
    Helpers.setZoom(0.7);

    //If development.
    if (process.env.NODE_ENV === 'development') {
      window["Dialogs"] = Dialogs;
      window["Tests"] = Tests;
      window["Helpers"] = Helpers;
      window["BridgeMain"] = BridgeMain;
      window["roll"] = BridgeMain.RollDiceFormula;
      document.onkeydown = function (evt) {
        //Bind test to "T" key to make testing faster.
        evt = evt || window.event;
        if (evt.key == 't') {
          TabletopHelperSite.BridgeDotNet.App.TestHttpClient();
        }
      };
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