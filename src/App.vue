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
import { onErrorCaptured, ref } from "vue";
import { useRouter } from "vue-router";
import usePiniaStore from "@/store/pinia";
// import { useStore } from "vuex";
// import { State } from "./store";

// const store = useStore<State>();
const pinia = usePiniaStore();
const router = useRouter();
const error = ref<Error>();

onErrorCaptured((caughtError) => {
  error.value = caughtError;
  return true;
});

// store.commit("setWindowDimensions");
pinia.setWindowDimensions(window.innerWidth, window.innerHeight);
if (window.innerWidth < 640) {
  pinia.isMobile = true;
  // store.commit("setIsMobile");
}
let sessionToken = localStorage.getItem("auth");
// let isActiveSession = sessionToken && !authenticated.value;
let isActiveSession = sessionToken && !pinia.authenticated;
if (isActiveSession) {
  // eslint-disable-next-line
  if (pinia.debug) console.log("Returning to an active session");
  pinia.authenticated = true;
  // store.commit("setAuthentication");
  router.push({ path: "/home" });
  // router.push({ name: 'Home', params: { groupID: groupID } });
}
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
