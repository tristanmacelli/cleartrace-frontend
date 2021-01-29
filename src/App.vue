<template>
  <div id="app">
    <!-- <router-link 
      v-if="showHomeLink"
      to="{ name: 'Home', params: {groupID: storedGroupID}}">
    <router-link v-if="this.showHomeLink" to="/home">Home</router-link>
    <router-link 
      v-if="showHomeLink" 
      to="{ name: 'Account', params: {userID: storedUserID}}">
    <router-link v-if="this.showAcctLink" to="/account">{{
      storedUserFirstname
    }}</router-link> -->
    <router-view />
  </div>
</template>

<script>
export default {
  name: "app",
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
}

html {
  background-color: #e9ebee;
}

.fixed {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1;
}
</style>
