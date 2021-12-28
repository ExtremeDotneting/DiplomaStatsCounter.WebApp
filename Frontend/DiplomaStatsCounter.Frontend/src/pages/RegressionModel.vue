<template>
  <v-container>
    <h3 class="comments-str">// Commits done from start.</h3>
    <h3 style="position: fixed; width: 100px">x1 =</h3>
    <v-text-field
      outlined
      style="width: 100px; margin-left: 50px"
      v-model="x1"
    ></v-text-field>

    <h3 class="comments-str">// Spend work hours.</h3>
    <h3 style="position: fixed; width: 100px">x2 =</h3>
    <v-text-field
      outlined
      v-model="x2"
      style="width: 100px; margin-left: 50px"
    ></v-text-field>

    <h3 class="comments-str">// Error coefficient.</h3>
    <h3>ε = 0.05</h3>

    <h3 class="comments-str">
      // Calculate output total lines of code (PROJECT SIZE) using regression
      model.
    </h3>
    <img src="../assets/formula1.png" />

    <h3>Y = 10^(ε+1.04+{{ x1 }}^0.04+{{ x2 }}^0.25)</h3>
    <h3>Y = {{ recalculate().predicted_y }}</h3>
    <br />
    <h3 class="comments-str">// Calculate intervals.</h3>
    <h3>
      {{ recalculate().trustInterval_Left }} &gt; Trusted_Interval &gt;
      {{ recalculate().trustInterval_Right }}
    </h3>
    <h3>
      {{ recalculate().predictedInterval_Left }} &gt; Predicted_Interval &gt;
      {{ recalculate().predictedInterval_Right }}
    </h3>
    <br />
    <br />
  </v-container>
</template>

<style scoped>
.comments-str {
  color: darkgreen;
}
</style>

<script>
export default {
  name: "RegressionModel",
  mounted() {},
  data() {
    return {
      x1: 1,
      x2: 2,
      Y: 0,
    };
  },
  methods: {
    toNumber() {},
    pow(a, b) {
      return Math.pow(a, b);
    },
    recalculate() {
      var x1 = Number(this.x1);
      var x2 = Number(this.x2);
      var epsilon = 0.05;

      //var sqrt = Math.sqrt;
      //var abs = Math.abs;
      var pow = Math.pow;

      //var Z = 16305.54;
      var student = 2.35183518; // Коеф. Стьюдента

      var predicted_y = pow(10, epsilon + 1.04 + pow(x1, 0.04) + pow(x2, 0.25)); //Предсказаное Y
      // var SZY = 0.120810582; // сумма квадратов разностей y
      // var SZX1 = 0.4378559; // сумма квадратов разницы x1 ????

      var trustedLastPart = 6240.073;
      var predictedLastPart = 86822.572;

      var trustInterval_Left = predicted_y - student * trustedLastPart; //доверительный лев. гр.

      var trustInterval_Right = predicted_y + student * trustedLastPart; //доверительный прав. гр.

      var predictedInterval_Left = predicted_y - student * predictedLastPart; //предсказательный лев. гр.

      var predictedInterval_Right = predicted_y + student * predictedLastPart; //предсказательный прав. гр.

      var res = {
        predicted_y,
        trustInterval_Left,
        trustInterval_Right,
        predictedInterval_Left,
        predictedInterval_Right,
      };
      return res;
    },
  },
};
</script>
