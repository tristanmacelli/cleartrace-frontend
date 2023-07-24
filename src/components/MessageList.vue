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
      class="grid grid-flow-row auto-rows-max flex-grow overflow-y-auto [overflow-anchor:auto] pt-4 px-2 sm:px-4 pb-0 bg-white"
    >
      <message
        v-for="(msg, index) in activeMessageList?.messages"
        :message="msg"
        :key="msg.id"
        :id="msg.channelID"
        :body="msg.body"
        :creator="msg.creator"
        :createdAt="msg.createdAt"
        :createdAtTime="msg.createdAtTime"
        @remove="activeMessageList?.messages.splice(index, 1)"
      ></message>
      <div id="anchor" class="[overflow-anchor:auto] h-px"></div>
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
import { storeToRefs } from "pinia";

const { bodyInput, GetMessages, SendMessage } = Messages();

const emit = defineEmits(["displayModal"]);

const pinia = usePiniaStore();
const groupsStore = useGroupsStore();
const messageStore = useMessagesStore();
const { debug, isMobile } = storeToRefs(pinia);
const { activeGroup, general } = storeToRefs(groupsStore);
const { activeMessageList } = storeToRefs(messageStore);
const disableSendMessage = computed(() => bodyInput.value.length === 0);
const isGeneral = computed(() => activeGroup.value.id === general.value.id);

// Clears the current messages & updates
watch(activeMessageList, async (newActiveMessageList) => {
  if (newActiveMessageList?.messages.length === 0) {
    if (debug.value) console.log("Getting Messages");
    await GetMessages();
  }
});

// Transition #groupList to the left
const OpenGroupList = () => {
  if (isMobile.value) {
    pinia.setIsGroupListOpen(true);
  }
};

// Scrolls to the bottom of an html tag (the tag must have an id).
const updateScroll = (htmlElementId: string) => {
  const element = document.getElementById(htmlElementId);
  if (element) element.scrollTop = element.scrollHeight;
};

const DisplayModalUpdate = () => {
  const modalData = {
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
</style>
