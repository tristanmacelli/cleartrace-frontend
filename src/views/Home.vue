<template>
  <div id="home" class="main">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";

export default {
  name: "Home",
  components: {
    HelloWorld
  },
  created: function() {
    console.log("Getting User");
    // let sessionToken = localStorage.getItem("auth")
    // request_user(auth.display_user_first_name, sessionToken)
    // new WebSocket("wss://slack.api.tristanmacelli.com/v1/ws?auth=" + sessionToken)
  }
};
</script>
