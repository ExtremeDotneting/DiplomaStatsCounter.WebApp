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
    var params = Helpers.getAllUrlParameters();
    var redirectNextTo = params["redirect_next_to"];
    if (redirectNextTo) {
      params["redirect_next_to"] = null;
      Helpers.redirectWithUrlParams(redirectNextTo, params);
    }
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
