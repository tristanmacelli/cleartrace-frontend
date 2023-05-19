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
          <FullScreenLoading v-else />
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
import { useRouter } from "vue-router";
import { defineAsyncComponent, onErrorCaptured, ref } from "vue";
import { storeToRefs } from "pinia";
import FullScreenLoading from "@/components/FullScreenLoading.vue";
import { Groups } from "@/api/messaging.service";
import { Users } from "@/api/users";
import usePiniaStore from "@/store/pinia";
import useGroupsStore from "@/store/groups";

const GroupList = defineAsyncComponent(
  () => import("../components/GroupList.vue")
);
const GroupModal = defineAsyncComponent(
  () => import("../components/GroupModal.vue")
);
const MessageList = defineAsyncComponent(
  () => import("../components/MessageList.vue")
);

const pinia = usePiniaStore();
const groupsStore = useGroupsStore();
const { general } = storeToRefs(groupsStore);
const router = useRouter();
const { GetGroups } = Groups();
const { SignOut } = Users();
const displayModal = ref(false);
const error = ref<Error>();

onErrorCaptured((capturedError, instance, info) => {
  // If it's not possible to retrieve the current user/socket, the user should be signed out
  // and returned to the landing page where they can log in.
  if (!pinia.user || !pinia.socket) SignOut();
  error.value = capturedError;
  if (pinia.debug) console.log(capturedError, instance, info);
  return true;
});
// This handles page refreshes or navigating back to the website
// during an active/expired session
let sessionToken = localStorage.getItem("auth");
if (!sessionToken) {
  router.push({ path: "/" });
}

const getGroups = GetGroups(); // This also gets the latest 100 messages for the first 20 groups
const setSocket = pinia.setSocket();
const setUser = pinia.setUser();
await Promise.all([setSocket, setUser, getGroups]);

// This is intended to populate the active group's messageList.
// In order for this to work GetGroups (with messages) must be called.
const generalWithMessages = groupsStore.getGroupByID(general.value.id);
groupsStore.setActiveGroup(generalWithMessages!, true);

const DisplayModal = () => {
  displayModal.value = true;
};

const HideModal = () => {
  displayModal.value = false;
  groupsStore.clearGroupModalData();
};
</script>
