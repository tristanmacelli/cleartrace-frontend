<template>
  <Suspense>
    <div id="app">
      <router-view />
    </div>
  </Suspense>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "app",
});
</script>

<script lang="ts" setup>
import { onErrorCaptured, onMounted, ref } from "vue";
import { storeToRefs } from "pinia";
import { useRouter } from "vue-router";
import usePiniaStore from "@/store/pinia";

const pinia = usePiniaStore();
const { debug } = storeToRefs(pinia);
const router = useRouter();
const error = ref<Error>();

onErrorCaptured((caughtError) => {
  error.value = caughtError;
  return true;
});

let sessionToken = localStorage.getItem("auth");
let isActiveSession = sessionToken && !pinia.authenticated;
if (isActiveSession) {
  // eslint-disable-next-line
  if (debug) console.log("Returning to an active session");
  pinia.authenticated = true;
  router.push({ path: "/home" });
  // router.push({ name: 'Home', params: { groupID: groupID } });
}

onMounted(() => {
  window.onresize = () => {
    pinia.setWindowDimensions(window.innerWidth, window.innerHeight);
    pinia.isMobile = window.innerWidth < 640;
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
