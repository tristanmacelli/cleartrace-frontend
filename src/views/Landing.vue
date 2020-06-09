<template>
  <div class="landing">
    <Signup @toggle-authentication="toggleAuth"></Signup>
  </div>
</template>

<script>
// @ is an alias to /src
import Signup from "@/components/Signup.vue";

export default {
  name: "Landing",
  components: {
    Signup
  },
  methods: {
    toggleAuth() {
      this.$emit("toggle-authentication");
    }
  }
};
</script>
