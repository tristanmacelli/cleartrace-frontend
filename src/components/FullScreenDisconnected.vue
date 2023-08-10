<template>
  <div
    class="h-screen w-screen grid absolute top-0 left-0 z-50 opacity-80 bg-gray-300"
  >
    <div class="w-fit grid gap-y-2 place-self-center">
      <img
        src="../assets/loading-spinner.svg"
        class="justify-self-center h-12 w-12"
        width="48"
        height="48"
      />
      <p>Attempting to reconnect to the server...</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "FullScreenDisconnected",
});
</script>
