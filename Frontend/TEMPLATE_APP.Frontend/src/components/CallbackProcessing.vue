<template>
  <Empty></Empty>
</template>

<script>
import Empty from "@/components/Empty";
import Helpers from "../../libs/helpers";
import UrlCallbacks from "../js/urlCallbacks";

export default {
  name: "CallbackProcessing",
  components: { Empty },
  async mounted() {
    var params = Helpers.getAllUrlParameters();
    var redirectNextTo = params["redirect_next_to"];
    if (redirectNextTo) {
      params["redirect_next_to"] = null;
      Helpers.redirectWithUrlParams(redirectNextTo, params);
    }

    var method = params["method"];
    if (method) {
      params["method"] = null;
      await UrlCallbacks[method](params);
      //window.location.href = "/";
    }
  },
  data() {
    return {};
  },
  methods: {},
};
</script>
