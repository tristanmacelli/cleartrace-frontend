<template>
  <div id="account" class="h-screen bg-cover">
    <User></User>
  </div>
</template>

<script>
import User from "@/components/User.vue";

export default {
  name: "Account",
  components: {
    User
  }
};
</script>
