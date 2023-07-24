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
          v-for="group in sortedGroupList"
          :key="group.index"
          :id="group.id"
          :name="group.name"
          :description="group.description"
          :private="group.private"
          :members="group.members"
          :creator="group.creator"
          :index="group.index"
          :createdAt="group.createdAt"
        ></group>
      </div>
    </div>
  </Transition>
</template>

<script lang="ts">
import { defineComponent } from "vue";

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
import { ref } from "vue";
import { Users } from "@/api/users";
import { ListItem } from "../types";
import { storeToRefs } from "pinia";

const emit = defineEmits(["displayModal"]);

const pinia = usePiniaStore();
const groupsStore = useGroupsStore();
const { sortedGroupList } = storeToRefs(groupsStore);
const { isGroupListOpen, isMobile } = storeToRefs(pinia);

const { SignOut } = Users();

const listItems = ref<ListItem[]>([]);

const items = ["Profile", "Settings", "Sign Out"];
listItems.value = items.map((item, index) => ({
  id: index,
  text: item,
}));

const AlertUnregistered = () => {
  confirm("We're sorry but this feature is still under development :/");
};

const CloseGroupList = () => {
  // Transition #groupList to the right
  if (isMobile.value) {
    pinia.setIsGroupListOpen(false);
  }
};

const DisplayModalCreate = () => {
  const modalData = {
    group: undefined,
    type: "create",
  };
  groupsStore.setGroupModalData(modalData);
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
</script>

<!-- TODO: Remove style tag & classes -->
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
</style>
