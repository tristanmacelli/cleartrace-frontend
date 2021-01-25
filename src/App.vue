<template>
  <div id="app">
    <div class="fixed container">
      <div id="nav">
        <router-link v-if="!this.storedAuth" to="/">
          <h1>Slack Clone</h1>
        </router-link>
        <!-- <router-link 
          v-if="storedAuth"
          to="{ name: 'Home', params: {channelId: storedChannelID}}"
        > -->
        <router-link v-if="this.storedAuth" to="/home">
          <h1>Slack Clone</h1>
        </router-link>
        <!-- <router-link 
          v-if="showHomeLink"
          to="{ name: 'Home', params: {channelId: storedChannelID}}"> -->
        <router-link v-if="this.showHomeLink" to="/home">Home</router-link>
        <!-- <router-link 
          v-if="showHomeLink" 
          to="{ name: 'Account', params: {userId: storedUserID}}"> -->
        <router-link v-if="this.showAcctLink" to="/account">{{
          storedUserFirstname
        }}</router-link>
        <Login v-if="!this.storedAuth"></Login>
        <Logout v-if="this.storedAuth"></Logout>
      </div>
    </div>
    <router-view />
    <!-- <ChannelUpdate></ChannelUpdate> -->
  </div>
</template>

<script>
import Login from "@/components/Login.vue";
import Logout from "@/components/Logout.vue";
// import ChannelUpdate from "@/components/ChannelUpdate.vue";

export default {
  name: "app",
  components: {
    Login,
    Logout //,
    // ChannelUpdate
  },
  computed: {
    // a computed getter
    storedAuth() {
      return this.$store.getters.getAuthentication;
    },
    storedSocket() {
      return this.$store.getters.getSocket;
    },
    storedChannelID() {
      return this.$store.getters.getChannelID;
    },
    storedUserID() {
      return this.$store.getters.getUserID;
    },
    storedUserFirstname() {
      return this.$store.getters.getUserFirstname || "Account";
    },
    showHomeLink() {
      return this.storedAuth && this.$router.currentRoute != "/home";
    },
    showAcctLink() {
      return this.storedAuth && this.$router.currentRoute != "/account";
    }
  },
  created: async function() {
    this.$router.push({ path: "/" });
    // await this.GetGeneralChannel();
    let sessionToken = localStorage.getItem("auth");
    let isActiveSession = sessionToken && !this.storedAuth;
    if (isActiveSession) {
      // console.log("Returning to an active session");
      this.$store.commit("setAuthentication");
      this.$store.commit("setSocket");
      this.$store.commit("setUser");
      this.$router.push({ path: "/home" });
      // this.$router.push({ name: 'Home', params: { channelId: storedChannelID } });
    }
  },
  methods: {
    async GetSpecificChannel(channelName) {
      var url =
        "https://slack.api.tristanmacelli.com/v1/channels?startsWith=" +
        channelName;
      let sessionToken = localStorage.getItem("auth");
      // send a get request with the above data
      let resp = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: sessionToken
        }
      });
      if (!resp.ok) {
        alert("Error: ", resp.status);
      }
      let channels = await resp.json();
      return channels;
    },
    async GetGeneralChannel() {
      let channels = await this.GetSpecificChannel("General");
      let general = channels[0];
      this.$store.commit("setChannel", {
        channelID: general.id,
        channelName: general.name
      });
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
