<template>
  <v-container>
    <v-card>
      <v-card-text>
        <h2>Activity</h2>
        <img :src="awesomeGithubStats" />

        <h2>Trophies</h2>
        <img :src="githubProfileTrophy" />
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import ApiClient from "../js/apiClient";

export default {
  name: "GitHubUserStats",
  async created() {
    var user = await ApiClient.getMe();
    this.GithubNickname = user.github_Login;
  },
  data() {
    return {
      GithubNickname: "",
    };
  },
  computed: {
    awesomeGithubStats: function () {
      var url =
        "https://awesome-github-stats.azurewebsites.net/user-stats/" +
        this.GithubNickname +
        "?cardType=level";
      return url;
    },
    githubProfileTrophy: function () {
      var url =
        "https://github-profile-trophy.vercel.app/?username=" +
        this.GithubNickname;
      return url;
    },
  },
  methods: {},
};
</script>
