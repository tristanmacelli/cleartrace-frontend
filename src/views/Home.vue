<template>
  <div
    id="home"
    class="h-screen w-screen bg-cover flex flex-nowrap items-center justify-center"
  >
    <div class="w-screen h-screen overflow-hidden">
      <Suspense :delay="0" :timeout="0">
        <template #default>
          <div class="flex w-full h-full">
            <div class="flex grow w-full sm:w-auto h-full">
              <MessageList @display-modal="DisplayModal" />
            </div>
            <!-- absolute is needed here to ensure proper resizing -->
            <div class="absolute sm:static w-full sm:w-64 md:w-96">
              <GroupList @display-modal="DisplayModal" />
            </div>
          </div>
        </template>
        <template #fallback>
          <div v-if="error" class="text-center text-2xl mt-20">
            {{ error }}
          </div>
          <HomeViewLoading v-else />
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
import HomeViewLoading from "@/components/HomeViewLoading.vue";
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
const { GetGroups } = Groups();
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

const getGroups = GetGroups(); // This also gets the latest 100 messages for the first 20 groups
const setSocket = store.dispatch("setSocket");
const setUser = store.dispatch("setUser");
await Promise.all([setSocket, setUser, getGroups]);

// This is intended to populate the active group's messageList.
// In order for this to work GetGroups (with messages) must be called.
const generalWithMessages = store.getters.getGroupByID(store.state.general.id);
store.commit("setGroup", {
  group: generalWithMessages,
});

const DisplayModal = () => {
  displayModal.value = true;
};

const HideModal = () => {
  displayModal.value = false;
};
</script>
