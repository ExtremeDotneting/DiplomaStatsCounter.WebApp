<template>
  <v-container>
    <v-card>
      <v-card-text>
        <v-tabs fixed-tabs background-color="white" color="primary">
          <v-tab @click="loadMyRepos()"> My repos </v-tab>
          <v-tab @click="loadReposUsedInTeaching()"> Used in teaching </v-tab>
        </v-tabs>
        <v-list dense>
          <v-subheader>{{Number(items.length)}} Repos</v-subheader>
          <div v-for="(item, i) in items" :key="i">
            <v-list-item>
              <!-- <v-list-item-icon>{{ item.language }} </v-list-item-icon> -->
              <v-list-item-content>
                <v-list-item-title v-text="item.name"></v-list-item-title>
                <v-list-item-subtitle>
                  <br />
                  {{ item.language + " | " }}
                  <a :href="item.htmlUrl" style="color: blue">{{
                    item.htmlUrl
                  }}</a>
                  <br />
                  <br />
                  <a :href="getOpenStatisticksUrl(item)">
                    <v-btn
                      x-small
                      class="mx-2"
                      outlined
                      color="primary"
                      rounded
                    >
                      <v-icon>timeline</v-icon>
                      Open statistics
                    </v-btn></a
                  >
                  <v-btn
                    x-small
                    class="mx-2"
                    outlined
                    :color="getIsUsedInTrainingColor(item)"
                    rounded
                    @click="swithcUseInTraining(item)"
                  >
                    {{ getIsUsedInTrainingText(item) }}
                  </v-btn>
                </v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>

            <v-divider></v-divider>
          </div>
        </v-list>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import ApiClient from "../js/apiClient";
import Consts from "../js/consts";

export default {
  isPage: true,
  name: "GitHubRepositories",
  async created() {
    await this.loadMyRepos();
  },
  data() {
    return {
      selectedItem: 1,
      items: [{ name: "Loading...", language: "Loading..." }],
    };
  },
  methods: {
    async loadMyRepos() {
      this.items = [{ name: "Loading...", language: "Loading..." }];
      var repos = await ApiClient.github_getMyRepositories();
      this.items = repos;
    },
    async loadReposUsedInTeaching() {
      this.items = [{ name: "Loading...", language: "Loading..." }];
      var repos = await ApiClient.github_getRepositoriesUsedInTeaching();
      this.items = repos;
    },
    getRepoItemSubtitle(item) {
      return item.language + " | " + item.htmlUrl;
    },
    getIsUsedInTrainingText(item) {
      if (item.isUsingInTeaching) {
        return "✓ Used in model training";
      } else {
        return "⨉ Not used in model training";
      }
    },
    getIsUsedInTrainingColor(item) {
      if (item.isUsingInTeaching) {
        return "#006629";
      } else {
        return "#d18800";
      }
    },
    getOpenStatisticksUrl(item) {
      var url = Consts.RepositoryStats + "?repo_url=" + encodeURI(item.htmlUrl);
      return url;
    },
    async swithcUseInTraining(item) {
      item.isUsingInTeaching = !item.isUsingInTeaching;
      await ApiClient.github_setUseInTeaching(item.id, item.isUsingInTeaching);
    },
  },
};
</script>
