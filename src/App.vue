<template>
  <Suspense>
    <div id="app">
      <router-view />
    </div>
  </Suspense>
</template>

<script>
import { computed, onErrorCaptured, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

export default {
  name: "app",
  setup() {
    const store = useStore();
    const router = useRouter();
    const authentication = computed(() => store.state.authentication);
    const error = ref(null);
    onErrorCaptured((caughtError) => {
      error.value = caughtError;
      return true;
    });

    store.commit("setWindowDimensions");
    if (window.innerWidth < 640) {
      store.commit("setIsMobile");
    }
    let sessionToken = localStorage.getItem("auth");
    let isActiveSession = sessionToken && !authentication.value;
    if (isActiveSession) {
      console.log("Returning to an active session");
      store.commit("setAuthentication");
      router.push({ path: "/home" });
      // router.push({ name: 'Home', params: { groupID: groupID } });
    }
    return { error };
  },
};
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
