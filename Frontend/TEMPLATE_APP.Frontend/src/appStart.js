import "../libs/http/httpClientSingleton";
import Vue from 'vue';
import App from '@/App.vue';
import vuetify from '@/plugins/vuetify';
import 'roboto-fontface/css/roboto/roboto-fontface.css';
import '@mdi/font/css/materialdesignicons.css';
import router from '@/js/router';
import './main.css';
import Helpers from "../libs/helpers.js"

function appStart() {
  try {
    Helpers.setZoom(0.7);
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
appStart();