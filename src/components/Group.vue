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
          <p class="font-bold grow truncate">{{ name }}</p>
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
import { latestMessageIndicator } from "@/utils";

export default defineComponent({
  name: "groupComponent",
});
</script>

<script lang="ts" setup>
import { computed } from "vue";
import usePiniaStore from "@/store/pinia";
import { LocalGroup, LocalMessage, LocalUser } from "../types";

const props = defineProps<{
  id: string;
  name: string;
  description: string;
  private: boolean;
  members: Array<number>;
  creator: LocalUser;
  messageList: LocalMessage[];
  unreadMessages?: LocalMessage[];
  index: number;
  createdAt: Date;
}>();

const pinia = usePiniaStore();
// If this is true we want to apply the same css rules as applied to the .group:hover class
const isStoredGroup = computed(() => props.id == pinia.activeGroup.id);
const latestMessage = computed(() =>
  props.messageList.at(props.messageList.length - 1)
);
const latestMessageDateTime = computed(() => {
  return latestMessageIndicator(new Date(latestMessage.value?.createdAt!));
});

const SetGroup = () => {
  if (!isStoredGroup.value) {
    let thisGroup: LocalGroup = {
      id: props.id,
      name: props.name,
      description: props.description,
      private: props.private,
      members: props.members,
      creator: props.creator,
      messageList: props.messageList,
      unreadMessages: [],
      createdAt: props.createdAt,
      index: props.index,
    };
    pinia.activeGroup = thisGroup;
  }
};
</script>
