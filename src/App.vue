<template>
  <div id="app">
    <div class="fixed container">
      <div id="nav">
        <router-link v-if="!authenticated" to="/">
          <h1>Slack Clone</h1>
        </router-link>
        <router-link v-if="authenticated" to="/home">
          <h1>Slack Clone</h1>
        </router-link>
        <router-link v-if="showHomeLink" to="/home">Home</router-link>
        <router-link v-if="showAcctLink" to="/account">{{
          firstname
        }}</router-link>
        <Login v-if="!authenticated"></Login>
        <Logout v-if="authenticated"></Logout>
      </div>
    </div>
    <router-view v-bind:Socket="socket" />
    <!-- <ChannelUpdate
      v-model="modalOpen"
      v-bind:ChannelName="channelName"
    ></ChannelUpdate> -->
  </div>
</template>

<script>
import EventBus from "@/event-bus";
import Login from "@/components/Login.vue";
import Logout from "@/components/Logout.vue";
// import ChannelUpdate from "@/components/ChannelUpdate.vue";

export default {
  name: "app",
  data() {
    return {
      authenticated: false,
      channelName: "",
      firstname: "Account",
      modalOpen: false,
      socket: null
    };
  },
  components: {
    Login,
    Logout //,
    // ChannelUpdate
  },
  methods: {
    toggleAuth() {
      this.authenticated = !this.authenticated;
    },
    toggleSocketConnection() {
      // Open WebSocket connection
      if (this.socket == null || this.socket.readyState === WebSocket.CLOSED) {
        let sessionToken = localStorage.getItem("auth");
        this.socket = new WebSocket(
          "wss://slack.api.tristanmacelli.com/v1/ws?auth=" + sessionToken
        );
        this.socket.onopen = function() {
          console.log("Successfully connected to the echo WebSocket server!");
          console.log(this.modalOpen);
        };
        this.socket.onclose = close => {
          this.socketOnClose(close);
        };
        this.socket.onerror = () => {
          console.log("Error originating from the echo websocket server...");
        };
        // this.socket is defined && this.socket.readyState === WebSocket.OPEN
      } else {
        // Close WebSocket connection
        this.socket.close();
        // Eventually this should be removed
        this.socket = null;
      }
    },
    socketOnClose() {
      if (close.wasClean) {
        console.log("Successfully disconnected to the echo WebSocket server!");
      } else {
        console.log(
          "Not able to cleanly disconnected from the WebSocket server."
        );
      }
    },
    beforeUnload() {
      if (performance.navigation.type != performance.navigation.TYPE_RELOAD) {
        console.log("Called beforeUnload && toggleSocketConnection");
        this.toggleSocketConnection();
      } else {
        // this.$router.push({ path: "/" });
      }
    }
  },
  computed: {
    // a computed getter
    showHomeLink: function() {
      return this.authenticated && this.$router.currentRoute != "/home";
    },
    showAcctLink: function() {
      return this.authenticated && this.$router.currentRoute != "/account";
    }
  },
  mounted() {
    EventBus.$on("toggle-authentication", () => {
      this.toggleAuth();
      // this.toggleSocketConnection();
    });
    EventBus.$on("toggle-websocket-connection", () => {
      this.toggleSocketConnection();
    });
    EventBus.$on("display-user-firstname", name => {
      this.firstname = name;
    });
  },
  created: function() {
    let sessionToken = localStorage.getItem("auth");
    if (sessionToken && !this.authenticated) {
      console.log("Returning to an active session");
      // console.log("Is this.socket null? ", this.socket == null);
      // console.log(
      //   this.socket == null || this.socket.readyState === WebSocket.CLOSED
      // );
      EventBus.$emit("toggle-authentication");
      EventBus.$emit("toggle-websocket-connection");
      this.$router.push({ path: "/home" });
    }
    document.addEventListener("beforeunload", this.beforeUnload);
  }
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

html {
  background-color: #e9ebee;
}

.main {
  background-size: cover;
  background-color: #e9ebee;
  padding-top: 11vh;
  height: 88vh;
}

body {
  margin: unset;
}

.fixed {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 10.8vh;

  z-index: 1;
  background-color: #113969;
  background-image: linear-gradient(#284b6b, #113969 50%);
  border-bottom: 1px solid #133783;
}

.container {
  margin: 0 auto;
}

h1 {
  font-family: "Open Sans", sans-serif;
}

#nav a {
  font-weight: bold;
  color: White;
  float: left;
  margin-left: 6em;
  padding: 2em 0.4em;
  cursor: pointer;
  text-decoration: none;
}

#nav a:first-of-type {
  padding: unset;
}
</style>
