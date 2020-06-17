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
    <router-view />
  </div>
</template>

<script>
import Login from "@/components/Login.vue";
import Logout from "@/components/Logout.vue";
import EventBus from "@/event-bus";

export default {
  name: "app",
  data() {
    return {
      authenticated: false,
      firstname: "Account"
    };
  },
  components: {
    Login,
    Logout
  },
  methods: {
    toggleAuth() {
      this.authenticated = !this.authenticated;
    },
    handleConnectionClose() {
      // Close WebSocket connection
      // connection.close();
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
    });
    EventBus.$on("display-user-firstname", name => {
      this.firstname = name;
    });
  },
  created: function() {
    let sessionToken = localStorage.getItem("auth");
    if (sessionToken && !this.authenticated) {
      this.toggleAuth();
    }
    document.addEventListener("beforeunload", this.handleConnectionClose);
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
