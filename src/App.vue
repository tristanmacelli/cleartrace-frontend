<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import { mapState } from "vuex";
import { Groups } from "@/api/messaging.service";

export default {
  name: "app",
  setup() {
    const { GetGeneralGroup } = Groups();
    return {
      GetGeneralGroup
    };
  },
  computed: mapState(["authentication"]),
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
      await this.$store.dispatch("setSocket");
      await this.$store.dispatch("setUser");
      this.$store.commit("setAuthentication");
      this.$router.push({ path: "/home" });
      // this.$router.push({ name: 'Home', params: { groupID: this.groupID } });
    } else {
      this.$router.push({ path: "/" });
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
