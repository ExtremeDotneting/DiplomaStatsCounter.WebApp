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
import ApiClient from "@/js/apiClient";
import router from "@/js/router.js";
import VueHelper from "../libs/vueHelpers";

export default {
  name: "App",

  mounted: async () => {
    var currentComponent = VueHelper.getVueComponentByRoute();
    if (currentComponent.isAuthRequired) {
      var isLogined = await ApiClient.isLogined();
      if (isLogined) {
        console.log("User was logined.");
      } else {
        router.push("signIn");
      }
    }
  },

  data: () => ({
    dialog: true,
  }),

  router: router,
};
</script>
