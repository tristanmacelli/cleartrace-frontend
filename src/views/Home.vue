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
              <MessageList @display-group-details="DisplayGroupDetails" />
            </div>
            <!-- absolute is needed here to ensure proper resizing -->
            <div class="absolute sm:static w-full sm:w-64 md:w-96">
              <GroupList @display-create-modal="DisplayCreateGroupModal" />
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
import { useRouter } from "vue-router";
import { storeToRefs } from "pinia";
import FullScreenLoading from "@/components/FullScreenLoading.vue";
import CreateGroupModal from "@/components/CreateGroupModal.vue";
import { Groups, Messages } from "@/api/messaging.service";
import { WebSocketService } from "@/api/websocket";
import { Users } from "@/api/users";
import usePiniaStore from "@/store/pinia";
import useGroupsStore from "@/store/groups";
import useMessagesStore from "@/store/messages";
import { getStoredActiveGroup } from "@/utils";
// import useUserStore from "@/store/users";

const GroupList = defineAsyncComponent(
  () => import("../components/GroupList.vue")
);
const GroupDetails = defineAsyncComponent(
  () => import("../components/GroupDetails.vue")
);
const MessageList = defineAsyncComponent(
  () => import("../components/MessageList.vue")
);

const { GetAllMessages } = Messages();
const { SetSocket } = WebSocketService();

const pinia = usePiniaStore();
const groupsStore = useGroupsStore();
const messageStore = useMessagesStore();
// const userStore = useUserStore();
const { debug, user, socket } = storeToRefs(pinia);
const { general, activeGroup } = storeToRefs(groupsStore);
const router = useRouter();
const { GetGroups } = Groups();
const { SignOut } = Users();
const displayGroupDetails = ref(false);
const displayCreateGroupModal = ref(false);
const modalGroup = ref<LocalGroup>();
const error = ref<Error>();

onErrorCaptured((capturedError, instance, info) => {
  // If it's not possible to retrieve the current user/socket, the user should be signed out
  // and returned to the landing page where they can log in.
  if (!user || !socket) SignOut();
  error.value = capturedError;
  if (debug) console.error(capturedError, instance, info);
  return true;
});
// This handles page refreshes or navigating back to the website
// during an active/expired session
const sessionToken = localStorage.getItem("auth");
if (!sessionToken) {
  router.push({ path: "/" });
}

await pinia.setUser();
// To render the group names without current user in the group name, the user must be set first
await GetGroups();
// To get all messages, the group list must be populated. Then, this method populates the messageList for all groups
await GetAllMessages();
// const uniqueUsers = await userStore.getUniqueUsers(); // This populates uniqueUsers

// GetGroups & GetAllMessages must be called beforehand in order for this block to work.
// This is intended to populate the active group's messageList.
const previousActiveGroup = getStoredActiveGroup();

if (
  previousActiveGroup &&
  previousActiveGroup.members.includes(user.value!.id)
) {
  groupsStore.setActiveGroup(previousActiveGroup);
} else {
  const hydratedGeneralGroup = groupsStore.getGroupByID(general.value.id);
  groupsStore.setActiveGroup(hydratedGeneralGroup!, true);
}

// To get the message list of the active group, an active group & messageLists must both be set
const messageList = messageStore.getMessageList(activeGroup.value.id);
messageStore.setActiveMessageList(messageList!);
// The GroupList component relies on this data
groupsStore.setSortedGroupList();

// The socket's onmessage handler requires a value for the active message list
await SetSocket();

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
