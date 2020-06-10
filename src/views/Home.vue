<template>
  <div id="home" class="main">
    <img alt="Vue logo" src="../assets/logo.png" />
    <HelloWorld msg="Welcome to Your Vue.js App" />
  </div>
</template>

<script>
// @ is an alias to /src
import HelloWorld from "@/components/HelloWorld.vue";
import EventBus from "../event-bus.js";

export default {
  name: "Home",
  components: {
    HelloWorld
  },
  created: function() {
    // console.log("Getting User");
    let sessionToken = localStorage.getItem("auth");
    if (!sessionToken) {
      this.$router.push({ path: "/" });
    }
    this.request_user(this.display_user_first_name, sessionToken);
    new WebSocket(
      "wss://slack.api.tristanmacelli.com/v1/ws?auth=" + sessionToken
    );
  },
  methods: {
    async request_user(display_user_fn, token) {
      let url = "https://slack.api.tristanmacelli.com/v1/users/";
      let resp = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: token
        }
      });
      if (!resp.ok) {
        alert("Error: ", resp.status);
      }
      let response = await resp.json();
      display_user_fn(response);
    },

    display_user_first_name(user) {
      EventBus.$emit("display-user-firstname", user.FirstName);
    }
  }
};
</script>
