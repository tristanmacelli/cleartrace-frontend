<template>
  <div id="home" class="main">
    <MessageStream
      v-bind:channelID="currentChannelID"
      v-bind:channelName="currentChannelName"
      v-bind:user="user"
    ></MessageStream>
    <Channels></Channels>
  </div>
</template>

<script>
// @ is an alias to /src
import MessageStream from "@/components/MessageStream.vue";
import Channels from "@/components/Channels.vue";
import EventBus from "../event-bus.js";

export default {
  name: "Home",
  components: {
    MessageStream,
    Channels
  },
  data() {
    return {
      connection: null,
      user: null,
      currentChannelID: "5edc3d54ac409b000c9935b8",
      currentChannelName: "General"
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
      this.user = response;
      display_user_fn();
    },

    display_user_first_name() {
      EventBus.$emit("display-user-firstname", this.user.FirstName);
    }
  }
};
</script>
