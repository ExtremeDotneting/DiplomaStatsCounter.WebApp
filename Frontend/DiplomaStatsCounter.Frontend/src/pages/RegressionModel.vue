<template>
  <v-container>
    <h3 class="comments-str">// Devs.</h3>
    <h3 style="width: 100px">x1 =</h3>
    <v-text-field
      outlined
      style="width: 100px; margin-left: 50px"
      v-model="x1"
    ></v-text-field>
    <h3 class="comments-str">// Commits made from the start.</h3>
    <h3 style="width: 100px">x2 =</h3>
    <v-text-field
      outlined
      v-model="x2"
      style="width: 100px; margin-left: 50px"
    ></v-text-field>

    <h3 id="regressionTextHere">{{ recalculate() }}</h3>
  </v-container>
</template>

<style scoped>
.comments-str {
  color: darkgreen;
}
</style>

<script>
import ApiClient from "../js/apiClient";

export default {
  isPage: true,
  name: "RegressionModel",
  async mounted() {
    this.n = await ApiClient.github_getRepositoriesUsedInTeachingCount();
  },
  data() {
    return {
      x1: 1,
      x2: 2,
      Y: 0,
      n: 1,
    };
  },
  methods: {
    toNumber() {},
    pow(a, b) {
      return Math.pow(a, b);
    },
    recalculate() {
      var pow = Math.pow;

      var e = 2.71;
      var x1 = Number(this.x1);
      var x2 = Number(this.x2);
      var pred_Y = pow(10, 1.04 + e) + x1 * 0.04 + x2 * 0.25;

      var trustedLastPart = 6240.073;
      var predictedLastPart = 86822.572;
      var student = 2.35183518 * Math.log10(this.n /*Magic*/); // Коеф. Стьюдента

      var trustInterval_Left = pred_Y - student * trustedLastPart; //доверительный лев. гр.

      var trustInterval_Right = pred_Y + student * trustedLastPart; //доверительный прав. гр.

      var predictedInterval_Left = pred_Y - student * predictedLastPart; //предсказательный лев. гр.

      var predictedInterval_Right = pred_Y + student * predictedLastPart; //предсказательный прав. гр.

      var outputText =
        `
ŷ = b0 + b1 * x1 + b2 * x2 
ŷ = 10^(1.04 + ε) + x1 * 0.04 + x2 * 0.25
ŷ = ` +
        pred_Y +
        `
-------------------------------------------------
` +
        trustInterval_Left +
        " &gt;  TrustedInterval &gt;  " +
        trustInterval_Right +
        "\n" +
        predictedInterval_Left +
        " &gt;  PredictedInterval &gt;  " +
        predictedInterval_Right +
        `

-------------------------------------------------

Calculation Summary
Sum of X1 = 428
Sum of X2 = 159655
Sum of Y = 7147199
Mean X1 = 12.5882
Mean X2 = 4695.7353
Mean Y = 210211.7353
Sum of squares (SSX1) = 2526.2353
Sum of squares (SSX2) = 345670324.6176
Sum of products (SPX1Y) = 7621745.2941
Sum of products (SPX2Y) = 13786073598.6176
Sum of products (SPX1X2) = 414982.2941

Regression Equation = ŷ = b1X1 + b2X2 + a

b1 = ((SPX1Y)*(SSX2)-(SPX1X2)*(SPX2Y)) / ((SSX1)*(SSX2)-(SPX1X2)*(SPX1X2)) = -3086365278858410/701034269747.06 = -4402.58831

b2 = ((SPX2Y)*(SSX1)-(SPX1X2)*(SPX1Y)) / ((SSX1)*(SSX2)-(SPX1X2)*(SPX1X2)) = 31663976344798.1/701034269747.06 = 45.16752

a = MY - b1MX1 - b2MX2 = 210211.74 - (-4402.59*12.59) - (45.17*4695.74) = 53537.85546
`;

      outputText = outputText.replaceAll("\n", "<br>");

      var textEl = document.getElementById("regressionTextHere");
      if (textEl) textEl.innerHTML = outputText;
    },
  },
};
</script>
