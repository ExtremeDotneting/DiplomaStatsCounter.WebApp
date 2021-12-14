<template>
  <v-container fluid fill-height class="loginOverlay">
    <v-layout flex align-center justify-center>
      <v-flex xs12 md6 elevation-6>
        <v-toolbar color="primary" extended extension-height="5">
          <v-toolbar-title class="white--text"> Sign in </v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>

        <v-card>
          <v-card-text class="pt-4">
            <div v-if="loginByNicknameVisible">
              <v-form v-model="valid" ref="form">
                <v-text-field
                  label="Enter your login"
                  v-model="login"
                  :rules="loginRules"
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
                    @click="login_ByNickname"
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

            <div v-if="loginByNicknameVisible && oauthCardVisible">
              <v-divider class="my-4"></v-divider>
              <h4 class="text-center">Or sigin in with</h4>
            </div>
            <div v-if="!loginByNicknameVisible">
              <h4 class="text-center">Sigin in with</h4>
            </div>

            <div v-if="oauthCardVisible">
              <v-btn
                v-if="githubAuthEnabled"
                class="my-2"
                outlined
                fab
                color="primary"
                rounded
                block
                >GitHub</v-btn
              >
            </div>
          </v-card-text>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import Helpers from "../../libs/helpers.js";
import ApiClient from "@/js/apiClient";
import AppConfigs from "../../libs/appConfigsImport/configsImporter.js";

export default {
  isPage: true,
  data() {
    var isOAuthEnabled = AppConfigs.Auth.GithubAuthEnabled;

    return {
      oauthCardVisible: isOAuthEnabled,
      githubAuthEnabled: AppConfigs.Auth.GithubAuthEnabled,
      loginByNicknameVisible: AppConfigs.Auth.LoginAuthEnabled,
      valid: false,
      passwordVisiblility: true,
      password: "",
      passwordRules: [(v) => !!v || "Password is required."],
      login: "",
      loginRules: [(v) => !!v || "Login is required."],
    };
  },
  methods: {
    validateEmail(email) {
      Helpers.validateEmail(email);
    },
    async login_ByNickname() {
      try {
        if (!this.$refs.form.validate()) {
          throw "Form validate error.";
        }
        await ApiClient.loginByNickname(this.login, this.password);
        window.location.href = "/";
      } catch (ex) {
        console.log(ex);
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
