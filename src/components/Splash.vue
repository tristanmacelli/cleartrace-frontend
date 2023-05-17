<template>
  <div v-once class="sm:h-72 lg:h-auto shadow-lg bg-white rounded-lg p-6">
    <h1 class="font-bold text-3xl lg:text-5xl text-center md:text-left">
      Cleartrace
    </h1>
    <p>Simply private messaging.</p>
    <img
      src="../assets/msgs-lg.svg"
      alt="A back-and-forth conversation in message bubbles"
      class="hidden sm:block sm:h-48 sm:w-96 lg:h-auto"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "splashModal",
});
</script>
