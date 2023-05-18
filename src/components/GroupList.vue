<template>
  <!-- https://dev.to/fayaz/making-a-navigation-drawer-sliding-sidebar-with-tailwindcss-blueprint-581l -->
  <Transition>
    <div
      id="groupList"
      v-if="isGroupListOpen"
      class="absolute sm:static sm:right-0 z-20 w-full sm:w-64 md:w-96 h-screen border-l border-gray-300 transform ease-in-out transition-all duration-300 bg-white"
      :class="isGroupListOpen ? 'show-groups-list' : 'hide-groups-list'"
    >
      <!-- TheRightMenu.vue -->
      <div class="flex no-wrap items-center px-2 h-20">
        <h3 class="flex-grow text-2xl ml-3">Conversations</h3>
        <button
          class="h-8 mx-1.5 rounded-3xl bg-gray-200 hover:bg-gray-300 focus:outline-none"
          @click="DisplayModalCreate"
        >
          <img
            src="../assets/plus.svg"
            class="p-2 overflow-hidden"
            width="32"
            height="32"
            alt="A plus icon"
          />
        </button>
        <Dropdown>
          <list
            @active-list-item="HandleListItem"
            :positionRight="true"
            :items="listItems"
          ></list>
        </Dropdown>
      </div>
      <!-- TheGroupList.vue -->
      <div class="px-2 divide-y">
        <group
          @click="CloseGroupList"
          @display-modal="DisplayModal"
          v-for="group in groupList"
          :key="group.index"
          :id="group.id"
          :name="group.name"
          :description="group.description"
          :private="group.private"
          :members="group.members"
          :creator="group.creator"
          :index="group.index"
          :messageList="group.messageList"
          :unreadMessages="group.unreadMessages"
          :createdAt="group.createdAt"
        ></group>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { PlaySound } from "@/utils";

export default defineComponent({
  name: "groupList",
});
</script>

<script lang="ts" setup>
import Group from "./Group.vue";
import Dropdown from "./Dropdown.vue";
import List from "./List.vue";
import usePiniaStore from "@/store/pinia";
import useGroupsStore from "@/store/groups";
import { computed, ref } from "vue";
import { Users } from "@/api/users";
import { ListItem } from "../types";

const emit = defineEmits(["displayModal"]);

const pinia = usePiniaStore();
const groupsStore = useGroupsStore();

const { SignOut } = Users();

const listItems = ref<ListItem[]>([]);
const width = ref(0);
const groupList = computed(() => groupsStore.groupList);
const isGroupListOpen = computed(() => pinia.isGroupListOpen);
const isMobile = computed(() => pinia.isMobile);
const socket = computed(() => pinia.socket);

let items = ["Profile", "Settings", "Sign Out"];
items.forEach((item, index) =>
  listItems.value.push({
    id: index,
    text: item,
  })
);
width.value = window.innerWidth;

const AlertUnregistered = () => {
  confirm("We're sorry but this feature is still under development :/");
};

const CloseGroupList = () => {
  // Transition #groupList to the right
  if (isMobile.value) {
    pinia.isGroupListOpen = false;
  }
};

const DisplayModalCreate = () => {
  let modalData = {
    group: undefined,
    type: "create",
  };
  groupsStore.groupModalData = modalData;
  DisplayModal();
};

const DisplayModal = () => {
  emit("displayModal");
};

const HandleListItem = async (item: ListItem) => {
  if (item.id == 2) {
    SignOut();
  } else {
    AlertUnregistered();
  }
};

socket.value!.onmessage = (event) => {
  // The data we created is in the event.data field
  // The current datatype of event is message
  let { message, type } = JSON.parse(event.data);
  if (type == "message-new" && message.groupID != groupsStore.activeGroup.id) {
    // Send a notification (noise, highlight group with message, update group w/ number
    // indicating the # of unread messages)
    PlaySound();
    // const unreadMessages = GetGroupUnreadMessages(GroupID);
    // store.dispatch('SetGroupUnreadMessages', [message, ...unreadMessages]);
  }
};
</script>

<style>
/* 
   TailwindCSS has utilites for position, but they do not properly remove
   the groups list element from the DOM when the user has navigated away on 
   mobile screens
*/
.show-groups-list {
  position: absolute;
}

.hide-groups-list {
  position: static;
}

/* we will explain what these classes do next! */
.v-enter-active,
.v-leave-active {
  transform: translateX(0px);
}

.v-enter-from,
.v-leave-to {
  transform: translateX(100%);
}
</style>
