<template>
  <div
    id="messageList"
    class="flex flex-col absolute sm:static z-10 w-full sm:w-auto grow h-full"
  >
    <div class="flex no-wrap h-20 px-5 py-6">
      <p class="flex-grow font-semibold text-lg self-center">
        {{ activeGroup.name }}
      </p>
      <div
        v-if="!isGeneral"
        @click.stop="DisplayModalUpdate"
        class="self-center cursor-pointer"
      >
        <img
          class="self-center"
          src="../assets/cog-64.png"
          width="32"
          height="32"
        />
      </div>
      <img
        src="../assets/hamburger-menu.svg"
        width="28"
        height="28"
        class="sm:hidden"
        @click="OpenGroupList"
        alt=""
      />
    </div>
    <div
      id="view-messages"
      class="grid grid-flow-row auto-rows-max flex-grow pt-4 px-2 sm:px-4 pb-0 bg-white overflow-y-auto"
    >
      <!-- TODO: Determine why createdAt property is not being propagated as Date type -->
      <message
        v-for="(msg, index) in activeMessageList?.messages"
        :message="msg"
        :key="msg.id"
        :id="msg.channelID"
        :body="msg.body"
        :creator="msg.creator"
        :createdAt="new Date(msg.createdAt)"
        :createdAtTime="msg.createdAtTime"
        @remove="activeMessageList?.messages.splice(index, 1)"
      ></message>
      <div id="anchor"></div>
    </div>
    <div class="w-full h-12 sm:h-14 bg-white p-3">
      <form
        v-on:submit.prevent="SendMessage"
        accept-charset="UTF-8"
        class="flex no-wrap"
      >
        <input
          class="flex-grow h-8 pl-3 pt-1 bg-gray-200 focus:outline-none rounded-2xl"
          id="messageBody"
          v-model="bodyInput"
          type="text"
          placeholder="Type a message..."
        />
        <input
          class="arrow w-6 h-5 ml-4 cursor-pointer self-center"
          :disabled="disableSendMessage"
          type="submit"
          value=" "
        />
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "messageList",
});
</script>

<script lang="ts" setup>
import { computed, watch, onMounted, onUpdated } from "vue";
import usePiniaStore from "@/store/pinia";
import useGroupsStore from "@/store/groups";
import useMessagesStore from "@/store/messages";
import { Messages } from "@/api/messaging.service";
import Message from "./Message.vue";
import { LocalMessage, ServerMessage } from "../types";
import { FormatDate, PlaySound, serverToClientMessage } from "@/utils";
import { storeToRefs } from "pinia";

const { bodyInput, GetMessages, SendMessage } = Messages();

const emit = defineEmits(["displayModal"]);

const pinia = usePiniaStore();
const groupsStore = useGroupsStore();
const messageStore = useMessagesStore();
const { socket } = storeToRefs(pinia);
const { activeGroup, getActiveGroupID } = storeToRefs(groupsStore);
const { activeMessageList } = storeToRefs(messageStore);
const disableSendMessage = computed(() => bodyInput.value.length === 0);
const isGeneral = computed(
  () => activeGroup.value.id === "5fec04e96d55740010123439"
);

// Clears the current messages & updates
watch(activeGroup, async () => {
  if (activeMessageList.value?.messages.length === 0) {
    if (pinia.debug) console.log("Getting Messages");
    await GetMessages();
  }
});

const OpenGroupList = () => {
  // Transition #groupList to the right
  if (pinia.isMobile) {
    pinia.setIsGroupListOpen(true);
  }
};

// Scrolls to the bottom of an html tag (the tag must have an id).
const updateScroll = (htmlElementId: string) => {
  const element = document.getElementById(htmlElementId);
  if (element) element.scrollTop = element.scrollHeight;
};

// Create initial message
if (activeGroup.value.name == "General") {
  const now = new Date();
  const dateString = FormatDate(now);

  let welcomeMessage: LocalMessage = {
    id: "",
    channelID: "-1",
    body: "Welcome to the " + activeGroup.value.name + " group",
    creator: {
      id: -1,
      email: "",
      firstName: "Automated",
      lastName: "",
      photoURL: "",
    },
    createdAt: now,
    createdAtTime: dateString,
  };

  messageStore.addToActiveMessageList(welcomeMessage);
  // messageList.value.push(welcomeMessage);
}

// This hook triggers on page refresh, piping in the current active groups messages.
// onBeforeMount(async () => {
//   messageList.value = activeGroup.value.messageList;
// });

socket.value!.onmessage = (event: MessageEvent<any>) => {
  if (pinia.debug) console.log("Message Received!");
  // The current datatype of event is message
  const receivedData = JSON.parse(event.data);
  const serverMessage: ServerMessage = receivedData.message;

  if (receivedData.type == "message-new") {
    // This is "default behavior", when messages are received on the active group
    const localMessage = serverToClientMessage(serverMessage);

    if (serverMessage.channelID == getActiveGroupID.value) {
      messageStore.addToActiveMessageList(localMessage);
    } else {
      messageStore.addUnreadMessage(localMessage);
    }
    PlaySound();
  }
};

const DisplayModalUpdate = () => {
  let modalData = {
    group: activeGroup.value,
    type: "update",
  };

  groupsStore.setGroupModalData(modalData);
  DisplayModal();
};

const DisplayModal = () => {
  emit("displayModal");
};

onMounted(() => {
  updateScroll("view-messages");
});

onUpdated(() => {
  updateScroll("view-messages");
});
</script>

<style>
.arrow {
  /* https://www.flaticon.com/free-icon/right-arrow_724954?term=send&page=1&position=19 */
  background: url("../assets/send.svg") no-repeat;
}

#view-messages {
  overflow-anchor: none;
}

#anchor {
  overflow-anchor: auto;
  height: 1px;
}
</style>
