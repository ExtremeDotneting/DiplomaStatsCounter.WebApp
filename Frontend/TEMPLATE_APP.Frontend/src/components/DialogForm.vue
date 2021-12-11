<template>
  <v-row justify="center">
    <v-dialog
      v-model="dialogOpened"
      :max-width="maxWidth"
      persistent
      :fullscreen="fullscreen"
      hide-overlay
    >
      <v-card>
        <!-- If fullscreen.-->
        <v-toolbar v-if="toolbarVisible && fullscreen" dark color="info">
          <v-btn icon dark @click="closeDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn
              dark
              v-for="btn in dialogButtons"
              :key="btn.text + 'top'"
              :text="!btn.disableTextBtnStyle"
              @click="buttonClicked(btn)"
            >
              {{ btn.text }}
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <!-- If not fullscreen.-->
        <v-toolbar v-if="toolbarVisible && !fullscreen" dark color="primary">
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-spacer></v-spacer>
          <v-toolbar-items>
            <v-btn icon dark @click="closeDialog">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-toolbar-items>
        </v-toolbar>

        <v-card-text v-if="!!dialogText">
          <br />
          <p>{{ dialogText }}</p>
        </v-card-text>

        <div :id="contentRandomId"></div>

        <v-divider v-if="!!dialogText"></v-divider>

        <!-- If not fullscreen.-->
        <!-- <v-card-actions class="card-actions"> -->
        <v-card-actions v-if="!fullscreen">
          <div v-for="btn in dialogButtons" :key="btn.text + 'left'">
            <v-btn
              v-if="btn.isLeftSide"
              :text="!btn.disableTextBtnStyle"
              @click="buttonClicked(btn)"
            >
              {{ btn.text }}
            </v-btn>
          </div>
          <v-spacer></v-spacer>
          <div v-for="btn in dialogButtons" :key="btn.text + 'right'">
            <v-btn
              v-if="!btn.isLeftSide"
              :text="!btn.disableTextBtnStyle"
              @click="buttonClicked(btn)"
            >
              {{ btn.text }}
            </v-btn>
          </div>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>


export default {
  name: "DialogForm",
  mounted() {
    this.closePromise = new Promise((resolve, reject) => {
      this.resolveClosePromise = resolve;
      this.rejectClosePromise = reject;
    }); 
  },
  data() {
    return {
      contentRandomId: "generated in mounted hook",
      dynamicComponent: "CharacterList",
      toolbarVisible: true,
      resultData: "Cancel",
      dialogOpened: true,
      fullscreen: true,
      maxWidth: 1000,
      title: "Dialog title",
      dialogText: "Text temp",
      dialogButtons: [
        {
          isLeftSide: true,
          text: "Ok",
          action: (comp) => {
            comp.resultData = "Ok";
            comp.closeDialog();
          },
        },
        {
          isLeftSide: false,
          text: "Cancel",
          action: (comp) => {
            comp.closeDialog();
          },
        },
      ],
    };
  },
  methods: {
    buttonClicked(btn) {
      btn.action(this);
    },
    closeDialog() {
      this.resolveClosePromise(this.resultData);
      this.dialogOpened = false;
    },
  },
};
</script>
