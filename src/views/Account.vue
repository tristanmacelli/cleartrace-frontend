<template>
  <div id="account" class="h-screen bg-cover">
    <User />
  </div>
</template>

<script>
import User from "@/components/User.vue";

export default {
  name: "AccountView",
  components: {
    User,
  },
};
</script>
