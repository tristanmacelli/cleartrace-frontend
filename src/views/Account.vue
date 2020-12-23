<template>
  <div id="account" class="main">
    <User></User>
  </div>
</template>

<script>
import User from "@/components/User.vue";

export default {
  name: "Account",
  props: {
    Socket: {
      type: Object,
      required: true
    }
  },
  components: {
    User
  },
  created: function() {
    // let sessionToken = localStorage.getItem("auth")
    // auth.request_user(auth.display_user, sessionToken)
  }
};
</script>
