<template>
  <div
    class="flex flex-nowrap px-4 py-3 truncate rounded-md cursor-pointer"
    :class="{ 'sm:bg-gray-100': isStoredGroup }"
    v-on:click="SetGroup"
  >
    <div class="w-full self-center flex flex-row">
      <span
        v-if="unreadMessages && unreadMessages.length > 0"
        class="w-2.5 h-2.5 bg-sky-600 rounded-lg self-center mr-3"
      ></span>
      <!-- https://css-tricks.com/flexbox-truncated-text/ -->
      <div class="grow min-w-0">
        <div class="flex flex-row">
          <p class="font-bold grow truncate">
            {{ name }}
          </p>
          <p class="text-sm font-extralight">
            {{ latestMessageDateTime }}
          </p>
        </div>
        <p class="font-extralight truncate">
          {{ latestMessage?.body || "..." }}
        </p>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "groupComponent",
});
</script>

<script lang="ts" setup>
import { computed } from "vue";
import useGroupsStore from "@/store/groups";
import useMessagesStore from "@/store/messages";
import { LocalGroup, LocalUser } from "../types";
import { latestMessageIndicator } from "@/utils";
import { storeToRefs } from "pinia";

const props = defineProps<{
  id: string;
  name: string;
  description: string;
  private: boolean;
  members: Array<number>;
  creator: LocalUser;
  index: number;
  createdAt: Date;
}>();

const groupsStore = useGroupsStore();
const messageStore = useMessagesStore();
const { getActiveGroupID } = storeToRefs(groupsStore);

// If this is true we want to apply the same css rules as applied to the .group:hover class
const isStoredGroup = computed(() => props.id == getActiveGroupID.value);

const latestMessage = computed(() => messageStore.getLatestMessage(props.id));
const latestMessageDateTime = computed(() => {
  if (latestMessage.value) {
    return latestMessageIndicator(latestMessage.value.createdAt);
  }
  return "";
});
const unreadMessages = computed(
  () => messageStore.getMessageList(props.id)?.unreadMessages
);

const SetGroup = () => {
  if (!isStoredGroup.value) {
    let thisGroup: LocalGroup = {
      id: props.id,
      name: props.name,
      description: props.description,
      private: props.private,
      members: props.members,
      creator: props.creator,
      createdAt: props.createdAt,
      index: props.index,
    };
    const messageList = messageStore.getMessageList(thisGroup.id);
    if (!messageList) {
      alert(
        "An unexpected error occurred.\nThe page will reload upon closing this message."
      );
      location.reload();
      return;
    }
    groupsStore.setActiveGroup(thisGroup);
    messageStore.setActiveMessageList(messageList);
  }
};
</script>
