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
      <message
        v-for="(msg, index) in messageList"
        :message="msg"
        :key="msg.channelID"
        :id="msg.channelID"
        :body="msg.body"
        :creator="msg.creator"
        :createdAt="msg.createdAt"
        :createdAtTime="msg.createdAtTime"
        @remove="messageList.splice(index, 1)"
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
import { onMounted } from "vue";

export default defineComponent({
  name: "messageList",
});
</script>

<script lang="ts" setup>
import { computed, onBeforeMount, watch } from "vue";
// import { useStore } from "vuex";
import usePiniaStore from "@/store/pinia";
import { Messages } from "@/api/messaging.service";
import Message from "./Message.vue";
// import { State } from "@/store";
import { LocalMessage, ServerMessage } from "../types";
import { FormatDate, PlaySound, serverToClientMessage } from "@/utils";

const { activeGroup, bodyInput, messageList, GetMessages, SendMessage } =
  Messages();

const emit = defineEmits(["displayModal"]);

// const store = useStore<State>();
const pinia = usePiniaStore();
const socket = computed(() => pinia.socket);
const disableSendMessage = computed(() => bodyInput.value.length === 0);
const isGeneral = computed(
  () => activeGroup.value.id === "5fec04e96d55740010123439"
);

// Clears the current messages & updates
// Make sure this still works with the composition API/our API extracted
watch(activeGroup, async () => {
  if (activeGroup.value.messageList.length === 0) {
    if (pinia.debug) console.log("Getting Messages");
    await GetMessages();
    if (pinia.debug) console.log(JSON.stringify(messageList.value));
  } else {
    messageList.value = activeGroup.value.messageList;
  }
});

watch(messageList, () => {
  updateScroll();
});

const OpenGroupList = () => {
  // Transition #groupList to the right
  if (pinia.isMobile) {
    pinia.isGroupListOpen = true;
    // store.commit("setIsGroupListOpen");
  }
};

const updateScroll = () => {
  const element = document.getElementById("view-messages");
  element!.scrollTop = element!.scrollHeight;
};

// Create initial message
if (activeGroup.value.name == "General") {
  const now = new Date();
  const dateString = FormatDate(now);

  let welcomeMessage: LocalMessage = {
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

  messageList.value.push(welcomeMessage);
}

// This hook triggers on page refresh, piping in the current active groups messages.
onBeforeMount(async () => {
  messageList.value = activeGroup.value.messageList;
});

socket.value!.onmessage = (event: MessageEvent<any>) => {
  // eslint-disable-next-line
  if (pinia.debug) console.log("Message Received!");
  // The current datatype of event is message
  const receivedData = JSON.parse(event.data);
  const serverMessage: ServerMessage = receivedData.message;

  if (receivedData.type == "message-new") {
    // This is "default behavior", when messages are received on the active group
    if (serverMessage.channelID == pinia.activeGroup.id) {
      const localMessage = serverToClientMessage(serverMessage);

      messageList.value.push(localMessage);
      PlaySound();
    }
  }
};

const DisplayModalUpdate = () => {
  console.log(`MessageList.vue line:169`);
  let modalData = {
    group: activeGroup.value,
    type: "update",
  };

  pinia.groupModalData = modalData;
  // store.commit("setgroupModalData", {
  //   groupModalData: modalData,
  // });
  DisplayModal();
};

const DisplayModal = () => {
  emit("displayModal");
};

onMounted(() => {
  updateScroll();
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
