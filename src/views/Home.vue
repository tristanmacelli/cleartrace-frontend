<template>
  <div id="home" class="main">
    <MessageStream
      channelID="5edc3d54ac409b000c9935b8"
      channelName="General"
      v-bind:user="user"
    ></MessageStream>
  </div>
</template>

<script>
// @ is an alias to /src
import MessageStream from "@/components/MessageStream.vue";
import EventBus from "../event-bus.js";

export default {
  name: "Home",
  components: {
    MessageStream
  },
  data() {
    return {
      connection: null,
      user: null
    };
  },
  created: function() {
    // console.log("Getting User");
    let sessionToken = localStorage.getItem("auth");
    if (!sessionToken) {
      this.$router.push({ path: "/" });
    }
    this.request_user(this.display_user_first_name, sessionToken);
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
      this.user = response;
    },

    display_user_first_name(user) {
      EventBus.$emit("display-user-firstname", user.FirstName);
    }
  }
};
</script>
