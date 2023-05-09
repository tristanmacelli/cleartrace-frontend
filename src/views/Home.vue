<template>
  <div
    id="home"
    class="h-screen w-screen bg-cover flex flex-nowrap items-center justify-center"
  >
    <div class="w-screen h-screen overflow-hidden">
      <Suspense :delay="0" :timeout="0">
        <template #default>
          <div>
            <MessageList />
            <GroupList @display-modal="DisplayModal" />
          </div>
        </template>
        <template #fallback>
          <div v-if="error" class="text-center text-2xl mt-20">
            {{ error }}
          </div>
          <div v-else class="h-screen w-screen place-content-center">
            <svg class="animate-spin h-5 w-5 mr-3 ..." viewBox="0 0 24 24">
              <!-- ... -->
            </svg>
            Loading...
          </div>
        </template>
      </Suspense>
    </div>
    <Suspense>
      <GroupModal v-if="displayModal" @hide-modal="HideModal" />
    </Suspense>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "HomeView",
});
</script>

<script lang="ts" setup>
// @ is an alias to /src
import { Groups } from "@/api/messaging.service";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { defineAsyncComponent, onErrorCaptured, ref } from "vue";
import { State } from "@/store";

const GroupList = defineAsyncComponent(
  () => import("../components/GroupList.vue")
);
const GroupModal = defineAsyncComponent(
  () => import("../components/GroupModal.vue")
);
const MessageList = defineAsyncComponent(
  () => import("../components/MessageList.vue")
);

const store = useStore<State>();
const router = useRouter();
const { GetGeneralGroup } = Groups();
const displayModal = ref(false);
const error = ref<Error>();

onErrorCaptured((capturedError, instance, info) => {
  error.value = capturedError;
  if (store.state.debug) console.log(capturedError, instance, info);
  return true;
});
// This handles page refreshes or navigating back to the website
// during an active/expired session
let sessionToken = localStorage.getItem("auth");
if (!sessionToken) {
  router.push({ path: "/" });
}

const getGeneralGroup = GetGeneralGroup();
const setSocket = store.dispatch("setSocket");
const setUser = store.dispatch("setUser");
await Promise.all([getGeneralGroup, setSocket, setUser]);

const DisplayModal = () => {
  displayModal.value = true;
};
const HideModal = () => {
  displayModal.value = false;
};
</script>
