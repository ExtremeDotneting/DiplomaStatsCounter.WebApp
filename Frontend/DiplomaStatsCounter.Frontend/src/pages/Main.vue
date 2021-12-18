<template>
  <div>
    <v-toolbar color="primary" dark flat>
      <svg
        height="32"
        viewBox="0 0 20 20"
        version="1.1"
        width="32"
        class="main-icon-svg"
        @click="redirectToMain"
      >
        <path
          d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z"
        ></path>
      </svg>
      <v-toolbar-title @click="redirectToMain">
        GitHub Stats Counter
      </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn text @click="logout">
        <v-icon color="icons">logout</v-icon>
        Logout
      </v-btn>

      <template v-slot:extension>
        <v-tabs v-model="tabNumber" align-with-title>
          <v-tabs-slider color="borders"></v-tabs-slider>

          <v-tab v-for="item in items" :key="item">
            {{ item }}
          </v-tab>
        </v-tabs>
      </template>
    </v-toolbar>

   <router-view></router-view>
  </div>
</template>

<script>
import SignIn from "@/pages/SignIn";
import Empty from "@/components/Empty";
import Helpers from "../../libs/helpers";
import VueHelpers from "../../libs/vueHelpers";
import ApiClient from "../js/apiClient";

const MyDefinition = {
  name: "Main",
  isAuthRequired: true,
  childRoutes: [SignIn, Empty],
  mounted() {
    //Redirect to '/main/childRoutes[0]' in it's '/main'
    //var innerComponentPath = VueHelpers.getVueComponentInfoByRoute(1);
    
  },
  data() {
    return {
      items: ["web", "shopping", "videos", "images", "news"],
      text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
    };
  },
  computed: {
    tabNumber: {
      // геттер:
      get: function () {
        return this._tabNumber;
      },
      // сеттер:
      set: function (index) {
        this._tabNumber = index;
        var myRouteDefinition =
          VueHelpers.getVueComponentInfoByComponent(MyDefinition);
        var urlOfFirstTab =
          myRouteDefinition.path + "/" + myRouteDefinition.children[index].path;
        console.log(urlOfFirstTab);
        this.$router.push(urlOfFirstTab);
      },
    },
  },
  methods: {
    redirectToMain() {
      Helpers.redirect("/");
    },
    async logout() {
      await ApiClient.logout();
      //$route.params.nestedRoutes
      Helpers.redirect("/");
    },
  },
};

export default MyDefinition;
</script>
