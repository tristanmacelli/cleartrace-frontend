<template>
  <div
    id="home"
    class="h-screen w-screen bg-cover flex flex-nowrap items-center justify-center"
  >
    <div class="w-screen h-screen overflow-hidden">
      <div class="flex w-full h-full">
        <div class="flex grow w-full sm:w-auto h-full">
          <MessageList @display-group-details="DisplayGroupDetails" />
        </div>
        <!-- absolute is needed here to ensure proper resizing -->
        <div class="absolute sm:static w-full sm:w-64 md:w-96">
          <GroupList @display-create-modal="DisplayCreateGroupModal" />
        </div>
      </div>
    </div>
    <Suspense>
      <GroupDetails
        v-if="modalGroup && displayGroupDetails"
        :group="modalGroup"
        @hide-modal="HideGroupDetails"
      />
    </Suspense>
    <CreateGroupModal
      v-if="displayCreateGroupModal"
      @hide-modal="HideCreateGroupModal"
    />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { LocalGroup } from "@/types";

export default defineComponent({
  name: "HomeView",
});
</script>

<script lang="ts" setup>
// @ is an alias to /src
import { defineAsyncComponent, onErrorCaptured, ref } from "vue";
import { storeToRefs } from "pinia";
import CreateGroupModal from "@/components/CreateGroupModal.vue";
import GroupList from "@/components/GroupList.vue";
import MessageList from "@/components/MessageList.vue";
import { Users } from "@/api/users";
import usePiniaStore from "@/store/pinia";
// import useUserStore from "@/store/users";

const GroupDetails = defineAsyncComponent(
  () => import("../components/GroupDetails.vue")
);

const pinia = usePiniaStore();
// const userStore = useUserStore();
const { debug, user, socket } = storeToRefs(pinia);
const { SignOut } = Users();
const displayGroupDetails = ref(false);
const displayCreateGroupModal = ref(false);
const modalGroup = ref<LocalGroup>();

onErrorCaptured((capturedError, instance, info) => {
  // If it's not possible to retrieve the current user/socket, the user should be signed out
  // and returned to the landing page where they can log in.
  if (!user || !socket) SignOut();
  if (debug) console.error(capturedError, instance, info);
  return true;
});

const DisplayCreateGroupModal = () => {
  displayCreateGroupModal.value = true;
};

const HideCreateGroupModal = () => {
  displayCreateGroupModal.value = false;
};

const DisplayGroupDetails = (group: LocalGroup) => {
  modalGroup.value = group;
  displayGroupDetails.value = true;
};

const HideGroupDetails = () => {
  displayGroupDetails.value = false;
};
</script>
