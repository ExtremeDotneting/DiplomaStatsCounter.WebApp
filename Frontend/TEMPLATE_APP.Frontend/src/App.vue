<template>
  <v-app>
    <v-main>
      <router-view></router-view>
      <div id="app-override-place" fluid fill-height>

      </div>
    </v-main>

    <!-- Crunch to disable eslint errors-->
    <component v-if="false" :is="None"></component>
  </v-app>
</template>

<script>
import { router, CharacterList, LoginPage, DialogForm } from "@/js/router.js";

export default {
  name: "App",

  components: {
    CharacterList,
    LoginPage,
    DialogForm,
  },

  data: () => ({
    dialog: true,
  }),

  router: router,
};
</script>
