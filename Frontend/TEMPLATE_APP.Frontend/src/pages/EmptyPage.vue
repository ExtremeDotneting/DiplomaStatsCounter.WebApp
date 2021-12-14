<template>
  <p>Loading....</p>
</template>

<script>
import AppConfigs from "../../libs/appConfigsImport/configsImporter";

export default {
  name: "EmptyPage",
  mounted() {},
  data() {
    var text = "";
    if (AppConfigs.DebugEnabled) {
      text = "On production this page will be empty.";
    }
    return {
      pageText: text,
    };
  },
  methods: {},
};
</script>
