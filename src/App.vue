<template>
  <div id="app">
    <Suspense>
      <router-view />
    </Suspense>
    <FullScreenLoading v-if="awaitingComponentData" />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { storeToRefs } from "pinia";

export default defineComponent({
  name: "app",
});
</script>

<script lang="ts" setup>
import { onErrorCaptured, onMounted } from "vue";
import usePiniaStore from "@/store/pinia";
import FullScreenLoading from "@/components/FullScreenLoading.vue";

const pinia = usePiniaStore();
const { awaitingComponentData, debug } = storeToRefs(pinia);

onErrorCaptured((caughtError, instance, info) => {
  if (debug) console.error(caughtError, instance, info);
  return true;
});

onMounted(() => {
  // Ensure mobile screens are detected properly on component mount.
  pinia.setIsMobile(window.innerWidth < 640);
  // Ensure mobile screen sizes are detected on window resize.
  window.onresize = () => {
    pinia.setIsMobile(window.innerWidth < 640);
  };
});
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
