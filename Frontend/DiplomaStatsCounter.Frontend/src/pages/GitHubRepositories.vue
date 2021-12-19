<template>
  <v-container>
    <v-card>
      <v-card-text>
        <v-list dense>
          <v-subheader>Repos</v-subheader>
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
                  <v-btn
                    x-small
                    class="mx-2"
                    outlined
                    color="primary"
                    rounded
                    @click="openStatisticksClick(item)"
                  >
                    <v-icon>timeline</v-icon>
                    Open statistics
                  </v-btn>
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
import Helpers from "../../libs/helpers"

export default {
  name: "GitHubRepositories",
  async created() {
    var repos = await ApiClient.github_getMyRepositories();
    this.items = repos;
  },
  data() {
    return {
      selectedItem: 1,
      items: [
        { name: "Loading...", language: "Loading..." },
      ],
    };
  },
  methods: {
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
    openStatisticksClick(item) {
      var url = Consts.RepositoryStats + "?repo_url=" + encodeURI(item.htmlUrl);
      Helpers.redirect(url);
    },
    async swithcUseInTraining(item) {
      item.isUsingInTeaching = !item.isUsingInTeaching;
      await ApiClient.github_setUseInTeaching(item.id, item.isUsingInTeaching);
    },
  },
};
</script>
