<template>
  <div id="app">
    <div class="fixed container">
      <div id="nav">
        <router-link
          @toggle-authentication="toggleAuth"
          v-if="!authenticated"
          to="/"
        >
          <h1>Slack Clone</h1>
        </router-link>
        <router-link v-if="authenticated" to="/home">
          <h1>Slack Clone</h1>
        </router-link>
        <router-link v-if="authenticated" to="/home">Home</router-link>
        <router-link v-if="authenticated" to="/account">Account</router-link>
        <Login
          @toggle-authentication="toggleAuth"
          v-if="!authenticated"
        ></Login>
        <Logout
          @toggle-authentication="toggleAuth"
          v-if="authenticated"
        ></Logout>
      </div>
    </div>
    <router-view />
  </div>
</template>

<script>
import Login from "@/components/Login.vue";
import Logout from "@/components/Logout.vue";

export default {
  name: "app",
  data() {
    return {
      authenticated: false
    };
  },
  components: {
    Login,
    Logout
  },
  methods: {
    toggleAuth() {
      this.authenticated = !this.authenticated;
    }
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

.main {
  background-size: cover;
  height: 100vh;
  background-color: #e8e8e8;
  padding-top: 120px;
}

.fixed {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;

  z-index: 1;
  background-color: #1f4068;
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
}

/* #nav a.router-link-exact-active {
  color: #42b983;
} */

#nav a:hover {
  background-color: #305f99;
  text-decoration: none;
}

#login {
  float: right;
  display: block;
  margin-left: 6em;
  margin-right: 6em;
  padding: 1.5em 0;
}
</style>
