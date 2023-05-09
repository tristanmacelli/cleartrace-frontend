<template>
  <div id="account" class="h-screen bg-cover">
    <User />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "AccountView",
});
</script>

<script lang="ts" setup>
import User from "@/components/User.vue";
</script>
