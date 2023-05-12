<template id="home-view-loading">
  <div class="h-screen w-screen grid">
    <div class="w-fit grid gap-y-2 place-self-center">
      <img
        src="../assets/loading-spinner.svg"
        class="justify-self-center h-12 w-12"
        width="48"
        height="48"
      />
      <p>Loading Conversations</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "HomeViewLoading",
});
</script>
