<template>
  <Empty></Empty>
</template>

<script>
import Empty from "@/components/Empty";
import Helpers from "../../libs/helpers";

export default {
  name: "CallbackProcessing",
  components: { Empty },
  mounted() {
    if (Helpers.getUrlParameter("redirect_next_to")) {
      var params = Helpers.getAllUrlParameters();
      Helpers.redirectWithUrlParams(
        Helpers.getUrlParameter("redirect_next_to"),
        params
      );
    }
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
