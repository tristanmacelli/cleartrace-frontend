<template>
  <div id="logout">
    <button @click="SignOut" class="pull-right">Log Out</button>
  </div>
</template>

<script>
import EventBus from "@/event-bus";

export default {
  name: "logOut",
  methods: {
    async SignOut() {
      let url = "https://slack.api.tristanmacelli.com/v1/sessions/mine";
      let sessionToken = localStorage.getItem("auth");

      // send a get request with the above data
      let resp = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: sessionToken
        }
      });
      if (!resp.ok) {
        let message = "Error: " + resp.status.toString();
        alert(message);
      }
      // let response = await resp.json();
      // console.log(response);
      localStorage.removeItem("auth");
      EventBus.$emit("toggle-authentication");
      if (this.$router.currentRoute != "/") {
        this.$router.push({ path: "/" });
      }
    }
  }
};
</script>

<style scoped>
.pull-right {
  float: right;
  display: block;
  margin-left: 6em;
  margin-right: 6em;
  padding: 1.5em 0;
}

nav ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

nav li {
  display: inline-block;

  position: relative;
}

nav a {
  color: White;
  text-decoration: none;
  text-transform: uppercase;
  font-size: 1.5em;
}

nav a:visited {
  color: white;
  text-decoration: none;
  font-size: 1.5em;
}
</style>
