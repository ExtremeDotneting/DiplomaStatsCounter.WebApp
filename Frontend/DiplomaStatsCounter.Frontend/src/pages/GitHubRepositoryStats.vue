<template>
  <v-container>
    <v-card>
      <v-card-subtitle>Detailed stats</v-card-subtitle>
      <v-card-text>
        <h4>Id: {{ repoInfo.id }}</h4>
        <h4>Name: {{ repoInfo.name }}</h4>
        <h4>
          URL:
          <a :href="repoInfo.htmlUrl" style="color: blue">{{
            repoInfo.htmlUrl
          }}</a>
        </h4>
        <h4>Language: {{ repoInfo.language }}</h4>
        <h4>Total commits: {{ repoInfo.totalCommits }}</h4>
        <h4>Pull request: {{ repoInfo.pullRequestsCount }}</h4>
        <h4>Opened issue: {{ repoInfo.openIssuesCount }}</h4>
        <h4>Total issue: {{ repoInfo.issuesCount }}</h4>
        <h4>Forks: {{ repoInfo.forksCount }}</h4>
        <h4>Watchers: {{ repoInfo.watchersCount }}</h4>
        <h4>Size: {{ repoInfo.size }} bytes</h4>

        <div style="width: 100%; overflow-x: auto">
          <div id="repoStatsChartContainer">
            <canvas id="repoStatsChart"></canvas>
          </div>
        </div>
      </v-card-text>
    </v-card>
  </v-container>
</template>

<script>
import Helpers from "../../libs/helpers.js";
import ApiClient from "../js/apiClient";
import { Chart } from "chart.js";
// import AppConfigs from "../../libs/appConfigsImport/configsImporter.js";
//import Consts from "../js/consts";

export default {
  name: "GitHubRepositoryStats",
  async created() {
    var repoUrl = Helpers.getUrlParameter("repo_url");
    var repoShortInfo = await ApiClient.github_getRepositoryByUrl(repoUrl);
    var repoInfo = await ApiClient.github_getRepositoryInfo(repoShortInfo.id);
    this.repoInfo = repoInfo;
    this.initChart(this.repoInfo);
    var div = document.getElementById("repoStatsChartContainer");
    var canv = document.getElementById("repoStatsChart");
    div.style.height = 300;
    canv.height = 300;
    div.style.width = repoInfo.weekCommitStats.length * 10 + "px";
    //canv.width = repoInfo.weekCommitStats.length * 10 + "px";
  },
  data() {
    return {
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
    initChart(repoInfo) {
      //       averageAdditionsLinesCount: 0,
      // averageDeletionsLinesCount: 0,
      // averageNewLinesCount: 0,
      // averageAuthorsCount: 0,
      // averageCommitsCount: 0,

      var commitsModifier = (repoInfo.averageCommitsCount + 1) / 200;
      var additionsModifier = (repoInfo.averageAdditionsLinesCount + 1) / 200;
      var deletionsModifier = (repoInfo.averageDeletionsLinesCount + 1) / 200;
      var newLinesModifier = (repoInfo.averageNewLinesCount + 1) / 200;
      var authorsModifier = (repoInfo.averageAuthorsCount + 1) / 200;

      var maxY = (repoInfo.averageAdditionsLinesCount / additionsModifier) * 7;
      var minY = -maxY / 100;
      console.log(maxY + " " + minY);

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
        commits.push(week.commitsCount / commitsModifier);
        additionsLinesCount.push(week.additionsLinesCount / additionsModifier);
        deletionsLinesCount.push(week.deletionsLinesCount / deletionsModifier);
        newLinesCount.push(week.newLinesCount / newLinesModifier);
        authorsCount.push(week.authorsCount / authorsModifier);
      }

      const ctx = document.getElementById("repoStatsChart").getContext("2d");
      const myChart = new Chart(ctx, {
        type: "line",
        data: {
          labels: labels,
          datasets: [
            {
              label: "Commits",
              data: commits,
              borderColor: ["rgba(54, 162, 235, 1)"],
            },
            {
              label: "Added lines",
              data: additionsLinesCount,
              borderColor: ["rgba(75, 192, 192, 1)"],
            },
            {
              label: "Deleted lines",
              data: deletionsLinesCount,
              borderColor: ["rgba(255, 99, 132, 1)"],
            },
            {
              label: "New lines",
              data: newLinesCount,
              borderColor: ["rgba(255, 206, 86, 1)"],
            },
            {
              label: "Authors",
              data: authorsCount,
              borderColor: ["rgba(153, 102, 255, 1)"],
            },
            // {
            //   label: "Commits",
            //   data: [12, 19, 3, 5, 2, 3],
            //   borderColor: [
            //     "rgba(255, 99, 132, 1)",
            //     "rgba(54, 162, 235, 1)",
            //     "rgba(255, 206, 86, 1)",
            //     "rgba(75, 192, 192, 1)",
            //     "rgba(153, 102, 255, 1)",
            //     "rgba(255, 159, 64, 1)",
            //   ],
            //   borderWidth: 1,
            // },
          ],
        },
        options: {
          scales: {
            y: {
              max: maxY,
              min: minY,
              display: false,
            },
          },
        },
      });

      console.log(myChart);
    },
  },
};
</script>
