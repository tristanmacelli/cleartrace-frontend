<template>
  <div id="app">
    <div class="fixed container">
      <div id="nav">
        <router-link v-if="!this.storedAuth" to="/">
          <h1>Cleartrace</h1>
        </router-link>
        <!-- <router-link 
          v-if="storedAuth"
          to="{ name: 'Home', params: {groupID: storedGroupID}}"
        > -->
        <router-link v-if="this.storedAuth" to="/home">
          <h1>Cleartrace</h1>
        </router-link>
        <!-- <router-link 
          v-if="showHomeLink"
          to="{ name: 'Home', params: {groupID: storedGroupID}}"> -->
        <router-link v-if="this.showHomeLink" to="/home">Home</router-link>
        <!-- <router-link 
          v-if="showHomeLink" 
          to="{ name: 'Account', params: {userID: storedUserID}}"> -->
        <router-link v-if="this.showAcctLink" to="/account">{{
          storedUserFirstname
        }}</router-link>
        <Login v-if="!this.storedAuth"></Login>
        <Logout v-if="this.storedAuth"></Logout>
      </div>
    </div>
    <router-view />
    <!-- <GroupUpdate></GroupUpdate> -->
  </div>
</template>

<script>
import Login from "@/components/Login.vue";
import Logout from "@/components/Logout.vue";
// import GroupUpdate from "@/components/GroupUpdate.vue";

export default {
  name: "app",
  components: {
    Login,
    Logout //,
    // GroupUpdate
  },
  computed: {
    // a computed getter
    storedAuth() {
      return this.$store.getters.getAuthentication;
    },
    storedSocket() {
      return this.$store.getters.getSocket;
    },
    storedGroupID() {
      return this.$store.getters.getGroupID;
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
    // await this.GetGeneralGroup();
    let sessionToken = localStorage.getItem("auth");
    let isActiveSession = sessionToken && !this.storedAuth;
    if (isActiveSession) {
      // console.log("Returning to an active session");
      this.$store.commit("setAuthentication");
      this.$store.commit("setSocket");
      this.$store.commit("setUser");
      this.$router.push({ path: "/home" });
      // this.$router.push({ name: 'Home', params: { groupID: storedGroupID } });
    }
  },
  methods: {
    async GetSpecificGroup(groupName) {
      var url =
        "https://slack.api.tristanmacelli.com/v1/channels?startsWith=" +
        groupName;
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
      let groups = await resp.json();
      return groups;
    },
    async GetGeneralGroup() {
      let groups = await this.GetSpecificGroup("General");
      let general = groups[0];
      this.$store.commit("setGroup", {
        groupID: general.id,
        groupName: general.name
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
