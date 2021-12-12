<template>
  <v-container fluid fill-height class="loginOverlay">
    <v-layout flex align-center justify-center>
      <v-flex xs12 sm4 elevation-6>
        <v-toolbar class="pt-5 blue darken-4">
          <v-toolbar-title class="white--text">
            <h4>Welcome Back</h4>
          </v-toolbar-title>
        </v-toolbar>
        <v-card>
          <v-card-text class="pt-4">
            <div>
              <v-form v-model="valid" ref="form">
                <v-text-field
                  label="Enter your e-mail address"
                  v-model="email"
                  :rules="emailRules"
                  required
                ></v-text-field>
                <v-text-field
                  label="Enter your password"
                  v-model="password"
                  min="5"
                  :append-icon="
                    passwordVisiblility ? 'visibility' : 'visibility_off'
                  "
                  @click:append="passwordVisiblilityToggle"
                  :type="passwordVisiblility ? 'password' : 'text'"
                  :rules="passwordRules"
                  counter
                  required
                ></v-text-field>
                <v-layout justify-space-between>
                  <v-btn
                    @click="submit"
                    :class="{
                      'blue darken-4 white--text': valid,
                      disabled: !valid,
                    }"
                    >Login</v-btn
                  >
                  <a href="">Forgot Password</a>
                </v-layout>
              </v-form>
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import helpers from "../../libs/helpers.js"

export default {
  name: "LoginPage",
  data() {
    return {
      valid: false,
      passwordVisiblility: true,
      password: "",
      passwordRules: [(v) => !!v || "Password is required."],
      email: "",
      emailRules: [
        (v) => !!v || "E-mail is required.",
        (v) => this.validateEmail(v) || "E-mail not valid.",
      ],
    };
  },
  methods: {
    validateEmail(email) {
      helpers.validateEmail(email);
    },
    submit() {
      if (this.$refs.form.validate()) {
        this.$refs.form.$el.submit();
      }
    },
    passwordVisiblilityToggle() {
      this.passwordVisiblility = !this.passwordVisiblility;
    },
    clear() {
      this.$refs.form.reset();
    },
  },
};
</script>
