<template>
  <div
    id="messageList"
    class="flex flex-col absolute z-10 w-full sm:w-4/5 h-full border-r border-gray-300"
  >
    <div class="flex no-wrap h-20 px-5 py-6">
      <p class="flex-grow font-semibold text-lg self-center">
        {{ group.name }}
      </p>
      <svg
        class="sm:hidden"
        @click="OpenGroupList"
        width="28px"
        height="28px"
        viewBox="0 0 28 28"
      >
        <path
          d="M4,10h24c1.104,0,2-0.896,2-2s-0.896-2-2-2H4C2.896,6,2,6.896,2,8S2.896,10,4,10z M28,14H4c-1.104,0-2,0.896-2,2  s0.896,2,2,2h24c1.104,0,2-0.896,2-2S29.104,14,28,14z M28,22H4c-1.104,0-2,0.896-2,2s0.896,2,2,2h24c1.104,0,2-0.896,2-2  S29.104,22,28,22z"
        />
      </svg>
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
        @remove="messageList.splice(index, 1)"
      ></message>
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
          v-model="body"
          type="text"
          placeholder="Type a message..."
        />
        <input
          class="arrow w-6 h-5 mx-4 cursor-pointer self-center"
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
import { computed, watch } from "vue";
import { useStore } from "vuex";
import { Messages } from "@/api/messaging.service";
import Message from "./Message.vue";
import { State } from "@/store";
import { LocalMessage, ServerMessage } from "..";
import { FormatDate, serverToClientMessage } from "@/utils";

const { group, body, messageList, GetMessages, SendMessage } = Messages();

const store = useStore<State>();
const socket = computed(() => store.state.socket);
const disableSendMessage = computed(() => body.value.length === 0);

// Clears the current messages & updates
// Make sure this still works with the composition API/our API extracted
watch(group, async () => {
  await GetMessages();
});

watch(messageList, () => {
  updateScroll();
});

const OpenGroupList = () => {
  // Transition #groupList to the right
  if (store.getters.getIsMobile) {
    store.commit("setIsGroupListOpen");
  }
};

const updateScroll = () => {
  let element = document.getElementById("view-messages");
  element!.scrollTop = element!.scrollHeight;
};

// Create initial message
if (group.value.name == "General") {
  const dateString = FormatDate(new Date());

  let welcomeMessage: LocalMessage = {
    channelID: "-1",
    body: "Welcome to the " + group.value.name + " group",
    creator: {
      id: -1,
      email: "",
      firstName: "Automated",
      lastName: "",
      photoURL: "",
    },
    createdAt: dateString,
  };

  messageList.value.push(welcomeMessage);
}
// Make query to server for last 100 messages
await GetMessages();

socket.value!.onmessage = (event: MessageEvent<any>) => {
  // eslint-disable-next-line
  if (store.state.debug) console.log("Message Received!");
  // The current datatype of event is message
  const receivedData = JSON.parse(event.data);
  const serverMessage: ServerMessage = receivedData.message;

  if (receivedData.type == "message-new") {
    // This is "default behavior", when messages are received on the active group
    if (serverMessage.channelID == store.state.activeGroup.id) {
      const localMessage = serverToClientMessage(serverMessage);

      messageList.value.push(localMessage);
      // PlaySound();
    }
  }
};
</script>

<style>
.arrow {
  /* https://www.flaticon.com/free-icon/right-arrow_724954?term=send&page=1&position=19 */
  background: url("../assets/send.svg") no-repeat;
}
</style>
