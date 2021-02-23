<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";

export default {
  name: "app",
  computed: mapState(["authentication", "serverURL"]),
  async created() {
    this.$store.commit("setWindowDimensions");
    if (window.innerWidth < 640) {
      this.$store.commit("setIsMobile");
    }
    let sessionToken = localStorage.getItem("auth");
    let isActiveSession = sessionToken && !this.authentication;
    if (isActiveSession) {
      console.log("Returning to an active session");
      await this.GetGeneralGroup();
      this.$store.commit("setAuthentication");
      await this.$store.dispatch("setSocket");
      await this.$store.dispatch("setUser");
      this.$router.push({ path: "/home" });
      // this.$router.push({ name: 'Home', params: { groupID: this.groupID } });
    } else {
      this.$router.push({ path: "/" });
    }
  },
  methods: {
    async GetSpecificGroup(groupName) {
      var url = this.serverURL + "v1/channels?startsWith=" + groupName;
      let sessionToken = localStorage.getItem("auth");
      // send a get request with the above data
      let groups = await axios
        .get(url, {
          headers: {
            Authorization: sessionToken
          }
        })
        .catch(error => {
          alert(error);
        })
        .then(response => {
          return response.data;
        });
      return groups;
    },
    async GetGeneralGroup() {
      let groups = await this.GetSpecificGroup("General");
      let general = groups[0];
      this.$store.commit("setGroup", {
        group: general
      });
      this.$store.commit("setGeneral", {
        group: general
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
</style>
