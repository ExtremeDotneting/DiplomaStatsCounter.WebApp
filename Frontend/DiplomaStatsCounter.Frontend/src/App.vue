<template>
  <v-app>
    <v-main>
      <router-view></router-view>
      <div id="app-override-place" fluid fill-height></div>
    </v-main>

    <!-- Crunch to disable eslint errors-->
    <component v-if="false" :is="None"></component>
  </v-app>
</template>

<script>
import ApiClient from "./js/apiClient";
import router from "./js/router.js";
import VueHelpers from "../libs/vueHelpers";
import Consts from "./js/consts";

export default {
  name: "App",

  mounted: async () => {
    var currentComponentInfo = VueHelpers.getVueComponentInfoByRoute();
    if(!currentComponentInfo){
      router.push(Consts.MainPath);
    }

    currentComponentInfo = VueHelpers.getVueComponentInfoByRoute();
    if (currentComponentInfo.component.isAuthRequired) {
      var isLogined = await ApiClient.isLogined();
      if (!isLogined) router.push(Consts.SignInPath);
    }
  },

  data: () => ({
    dialog: true,
  }),

  router: router,
};
</script>
