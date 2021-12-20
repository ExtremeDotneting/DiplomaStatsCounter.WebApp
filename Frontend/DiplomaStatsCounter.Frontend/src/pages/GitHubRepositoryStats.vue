<template>
  <v-container>
    <v-card>
      <v-card-subtitle>Detailed stats</v-card-subtitle>
      <v-card-text>
        <div v-if="!repoLoaded">
          <v-text-field
            label="Enter repository url"
            v-model="searchingRepoUrl"
          ></v-text-field>
          <v-btn outlined @click="findRepo">Find</v-btn>
        </div>

        <div v-if="repoLoaded">
          <p id="statsStrEl"></p>

          <v-btn
            small
            outlined
            :color="getIsUsedInTrainingColor(repoInfo)"
            rounded
            @click="swithcUseInTraining(repoInfo)"
          >
            {{ getIsUsedInTrainingText(repoInfo) }}
          </v-btn>
          <h1 class="text-center">Info</h1>
          <h4>Id: {{ repoInfo.id }}</h4>
          <h4>Name: {{ repoInfo.name }}</h4>
          <h4>
            URL:
            <a :href="repoInfo.htmlUrl" style="color: blue">{{
              repoInfo.htmlUrl
            }}</a>
          </h4>
          <h4>Language: {{ repoInfo.language }}</h4>
          <h4>Pull request: {{ repoInfo.pullRequestsCount }}</h4>
          <h4>Opened issue: {{ repoInfo.openIssuesCount }}</h4>
          <h4>Total issue: {{ repoInfo.issuesCount }}</h4>
          <h4>Forks: {{ repoInfo.forksCount }}</h4>
          <h4>Watchers: {{ repoInfo.watchersCount }}</h4>
          <h4>Size: {{ repoInfo.size }} bytes</h4>
          <br />
          <v-divider></v-divider>
          <br />
          <h1 class="text-center">Stats</h1>
          <h4>Total commits: {{ repoInfo.totalCommits }}</h4>
          <h4>
            Total added lines: {{ repoInfo.totalAdditionsLinesCount }} bytes
          </h4>
          <h4>
            Total deleted lines: {{ -repoInfo.totalDeletionsLinesCount }} bytes
          </h4>
          <h4>Total deleted lines: {{ repoInfo.totalNewLinesCount }} bytes</h4>
          <h4>
            Monthly average commits:
            {{ repoInfo.averageCommitsCount * 4 }} bytes
          </h4>
          <h4>
            Monthly average added lines:
            {{ repoInfo.averageAdditionsLinesCount * 4 }} bytes
          </h4>
          <h4>
            Monthly average deleted lines:
            {{ -repoInfo.averageDeletionsLinesCount * 4 }} bytes
          </h4>
          <h4>
            Monthly average deleted lines:
            {{ repoInfo.averageNewLinesCount * 4 }} bytes
          </h4>
          <h4>
            Monthly average authors:
            {{ repoInfo.averageAuthorsCount * 2 }} bytes
          </h4>
          <br />
          <v-divider></v-divider>
          <br />
          <div id="repoStatsChart" style="height: 370px; width: 100%"></div>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import Helpers from "../../libs/helpers.js";
import ApiClient from "../js/apiClient";
import Consts from "../js/consts";

export default {
  name: "GitHubRepositoryStats",
  async created() {
    var repoUrl = Helpers.getUrlParameter("repo_url");
    if (!repoUrl) {
      this.repoLoaded = false;
      return;
    }
    var repoShortInfo = await ApiClient.github_getRepositoryByUrl(repoUrl);
    var repoInfo = await ApiClient.github_getRepositoryInfo(repoShortInfo.id);
    this.repoInfo = repoInfo;
    this.initChart(this.repoInfo);
    //this.addStatsString(this.repoInfo);
  },
  data() {
    return {
      repoLoaded: true,
      searchingRepoUrl: null,
      repoInfo: {
        id: "Loading...",
        name: "Loading...",
        fullName: "Loading...",
        createdAt: "",
        updatedAt: "",
        description: "Loading...",
        forksCount: "Loading...",
        gitUrl: "",
        htmlUrl: "Loading...",
        language: "Loading...",
        openIssuesCount: "Loading...",
        issuesCount: "Loading...",
        size: "Loading...",
        watchersCount: "Loading...",
        pullRequestsCount: "Loading...",
        totalCommits: "Loading...",
        isUsingInTeaching: true,
        totalAdditionsLinesCount: 0,
        totalDeletionsLinesCount: 0,
        totalNewLinesCount: 0,
        averageAdditionsLinesCount: 0,
        averageDeletionsLinesCount: 0,
        averageNewLinesCount: 0,
        averageAuthorsCount: 0,
        averageCommitsCount: 0,
        weekCommitStats: [
          {
            weekNumber: 735202,
            weekDate: "2013-12-01T00:00:00Z",
            commitsCount: 1,
            additionsLinesCount: 346438,
            deletionsLinesCount: 0,
            newLinesCount: 346438,
            totalLinesCount: 346438,
            totalCommitsCount: 1,
            authorsCount: 1,
          },
        ],
      },
    };
  },
  methods: {
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
    async swithcUseInTraining(item) {
      item.isUsingInTeaching = !item.isUsingInTeaching;
      await ApiClient.github_setUseInTeaching(item.id, item.isUsingInTeaching);
    },
    findRepo() {
      if (this.searchingRepoUrl) {
        var url =
          Consts.RepositoryStats +
          "?repo_url=" +
          encodeURI(this.searchingRepoUrl);
        Helpers.redirect(url);
      }
    },
    addStatsString(repoInfo) {
      var splitter = "\t";
      var str =
        repoInfo.name +
        splitter +
        repoInfo.htmlUrl +
        splitter +
        repoInfo.totalCommits +
        splitter +
        repoInfo.totalAdditionsLinesCount +
        splitter +
        -repoInfo.totalDeletionsLinesCount +
        splitter +
        repoInfo.totalNewLinesCount;
      str +=
        splitter +
        repoInfo.averageCommitsCount * 4 +
        splitter +
        repoInfo.averageAdditionsLinesCount * 4 +
        splitter +
        -repoInfo.averageDeletionsLinesCount * 4 +
        splitter +
        repoInfo.averageNewLinesCount * 4 +
        splitter +
        repoInfo.averageAuthorsCount * 2;
      var statsStrEl = document.getElementById("statsStrEl");
      statsStrEl.innerHTML = str;
      navigator.clipboard.writeText(str);
    },
    initChart(repoInfo) {
      //       averageAdditionsLinesCount: 0,
      // averageDeletionsLinesCount: 0,
      // averageNewLinesCount: 0,
      // averageAuthorsCount: 0,
      // averageCommitsCount: 0,

      // var commitsModifier = (repoInfo.averageCommitsCount + 1) / 200;
      // var additionsModifier = (repoInfo.averageAdditionsLinesCount + 1) / 200;
      // var deletionsModifier = (repoInfo.averageDeletionsLinesCount + 1) / 200;
      // var newLinesModifier = (repoInfo.averageNewLinesCount + 1) / 200;
      // var authorsModifier = (repoInfo.averageAuthorsCount + 1) / 200;

      // var maxY = (repoInfo.averageAdditionsLinesCount / additionsModifier) * 7;
      // var minY = -maxY / 100;
      //console.log(maxY + " " + minY);

      var labels = [];
      var commits = [];
      var additionsLinesCount = [];
      var deletionsLinesCount = [];
      var newLinesCount = [];
      var authorsCount = [];
      for (var index in repoInfo.weekCommitStats) {
        var week = repoInfo.weekCommitStats[index];
        var weekDate = week.weekDate.split("T")[0];
        labels.push(weekDate);
        commits.push(week.commitsCount);
        additionsLinesCount.push(week.additionsLinesCount);
        deletionsLinesCount.push(-week.deletionsLinesCount);
        if (week.newLinesCount < 0) {
          week.newLinesCount = -week.newLinesCount;
        }
        newLinesCount.push(week.newLinesCount);
        authorsCount.push(week.authorsCount);
      }

      var chart = new window.CanvasJS.Chart("repoStatsChart", {
        animationEnabled: true,
        title: {
          text: "Repo stats chart",
        },
        axisX: {},
        axisY: {
          valueFormatString: " ",
        },
        legend: {
          cursor: "pointer",
          fontSize: 16,
        },
        toolTip: {
          shared: true,
        },
        zoomEnabled: true,
        data: [
          {
            name: "Date",
            type: "spline",
            shoInLegend: false,
            dataPoints: [],
          },
          {
            name: "Commits",
            type: "spline",
            dataPoints: [],
          },
          {
            type: "spline",
            name: "Added lines",
            dataPoints: [],
          },
          {
            type: "spline",
            name: "Deleted lines",
            dataPoints: [],
          },
          {
            type: "spline",
            name: "New lines",
            dataPoints: [],
          },
          {
            type: "spline",
            name: "Authors",
            dataPoints: [],
          },
        ],
      });

      addDataPoints();
      chart.render();

      function addDataPoints() {
        for (var i = 0; i < labels.length; i++) {
          chart.options.data[0].dataPoints.push({
            x: i,
            y: labels[i],
          });
          chart.options.data[1].dataPoints.push({
            x: i,
            y: commits[i],
          });
          chart.options.data[2].dataPoints.push({
            x: i,
            y: additionsLinesCount[i],
          });
          chart.options.data[3].dataPoints.push({
            x: i,
            y: deletionsLinesCount[i],
          });
          chart.options.data[4].dataPoints.push({
            x: i,
            y: newLinesCount[i],
          });
          chart.options.data[5].dataPoints.push({
            x: i,
            y: authorsCount[i],
          });
        }
      }
    },
  },
};
</script>
