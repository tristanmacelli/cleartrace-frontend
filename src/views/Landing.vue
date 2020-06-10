<template>
  <div id="landing" class="main">
    <Signup @toggle-authentication="toggleAuth"></Signup>
  </div>
</template>

<script>
// @ is an alias to /src
import Signup from "@/components/Signup.vue";
import EventBus from "@/event-bus";

export default {
  name: "Landing",
  components: {
    Signup
  },
  methods: {
    toggleAuth() {
      EventBus.$emit("toggle-authentication");
    }
  },
  created: function() {
    let sessionToken = localStorage.getItem("auth");
    if (sessionToken) {
      this.toggleAuth();
      this.$router.push({ path: "/home" });
    }
  }
};
</script>
