<template>
  <div id="home" class="main">
    <MessageStream
      v-bind:ChannelID="currentChannelID"
      v-bind:ChannelName="currentChannelName"
      v-bind:Socket="socket"
      v-bind:User="user"
    ></MessageStream>
    <Channels v-bind:Socket="socket"></Channels>
  </div>
</template>

<script>
// @ is an alias to /src
import MessageStream from "@/components/MessageStream.vue";
import Channels from "@/components/Channels.vue";
import EventBus from "../event-bus.js";

export default {
  name: "Home",
  props: {
    Socket: {
      type: Object,
      required: true
    }
  },
  components: {
    MessageStream,
    Channels
  },
  data() {
    return {
      connection: null,
      currentChannelID: "5edc3d54ac409b000c9935b8",
      currentChannelName: "General",
      socket: this.Socket,
      user: null
    };
  },
  created: function() {
    let sessionToken = localStorage.getItem("auth");
    if (!sessionToken) {
      this.$router.push({ path: "/" });
    }
    // this.handleConnectionCreation();
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
    // handleConnectionCreation() {
    //   let sessionToken = localStorage.getItem("auth");
    //   this.socket = new WebSocket(
    //     "wss://slack.api.tristanmacelli.com/v1/ws?auth=" + sessionToken
    //   );
    // },
    // handleConnectionClose() {
    //   // Close WebSocket connection
    //   this.socket.close();
    // }
  }
};
</script>
