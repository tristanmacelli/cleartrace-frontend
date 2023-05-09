<template>
  <!-- https://dev.to/fayaz/making-a-navigation-drawer-sliding-sidebar-with-tailwindcss-blueprint-581l -->
  <div
    id="groupList"
    class="absolute sm:right-0 z-20 w-full sm:w-1/5 h-screen transform ease-in-out transition-all duration-300 bg-white"
    :class="
      isGroupListOpen
        ? 'translate-x-0 show-groups-list'
        : 'translate-x-full hide-groups-list'
    "
  >
    <!-- TheRightMenu.vue -->
    <div class="flex no-wrap items-center px-2 h-20">
      <p class="h-8 mx-1.5 pt-1.5 px-1 bg-gray-200 rounded-3xl">
        {{ initials }}
      </p>
      <h3 class="flex-grow text-2xl">Conversations</h3>
      <button
        class="h-8 mx-1.5 rounded-3xl bg-gray-200 hover:bg-gray-300 focus:outline-none"
        @click="DisplayModalCreate"
      >
        <svg class="w-8 h-8 p-2" viewBox="0 0 512 512">
          <g>
            <g>
              <path
                d="M492,236H276V20c0-11.046-8.954-20-20-20c-11.046,0-20,8.954-20,20v216H20c-11.046,0-20,8.954-20,20s8.954,20,20,20h216 v216c0,11.046,8.954,20,20,20s20-8.954,20-20V276h216c11.046,0,20-8.954,20-20C512,244.954,503.046,236,492,236z"
              />
            </g>
          </g>
        </svg>
      </button>
      <Dropdown>
        <list
          @active-list-item="HandleListItem"
          positionRight
          :items="listItems"
        ></list>
      </Dropdown>
    </div>
    <!-- TheGroupList.vue -->
    <div class="px-2">
      <group
        @click="CloseGroupList"
        @display-modal="DisplayModal"
        v-for="group in groupList"
        :key="group.index"
        :index="group.index"
        :creator="group.creator"
        :description="group.description"
        :id="group.id"
        :members="group.members"
        :name="group.name"
      ></group>
    </div>
  </div>
</template>

<!-- beforeMount: async () => {
  socket.value.onmessage = event => {
    // The data we created is in the event.data field
    // The current datatype of event is message
    let receivedObj = JSON.parse(event.data);
    let messageObj = receivedObj.message;
    if (receivedObj.type == "message-new") {
      if (messageObj.groupID != store.state.activeGroup.id) {
        // Send a notification (noise, highlight group with message, update group w/ number
        //                      indicating the # of unread messages)
      }
    }
  };
}, -->

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
import { useStore } from "vuex";
import { computed, ref } from "vue";
import { Users } from "@/api/users";
import { Groups } from "@/api/messaging.service";
import { ListItem } from "..";
import { State } from "@/store";

const emit = defineEmits(["displayModal"]);

const store = useStore<State>();
const { GetGroups } = Groups();
const { SignOut } = Users();

const listItems = ref<ListItem[]>([]);
const width = ref(0);
const groupList = computed(() => store.state.groupList);
const isGroupListOpen = computed(() => store.state.isGroupListOpen);
const isMobile = computed(() => store.state.isMobile);
const initials = computed(() => store.getters.getUserInitials);
const socket = computed(() => store.state.socket);

let items = ["Profile", "Settings", "Sign Out"];
items.forEach((item, index) =>
  listItems.value.push({
    id: index,
    text: item,
  })
);
width.value = window.innerWidth;
await GetGroups();

const AlertUnregistered = () => {
  confirm("We're sorry but this feature is still under development :(");
};

const CloseGroupList = () => {
  // Transition #groupList to the right
  if (isMobile.value) {
    store.commit("clearIsGroupListOpen");
  }
};

const DisplayModalCreate = () => {
  let newBuffer = {
    group: null,
    type: "create",
  };
  store.commit("setgroupModalData", {
    groupModalData: newBuffer,
  });
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
  if (type == "message-new" && message.groupID != store.state.activeGroup.id) {
    // Send a notification (noise, highlight group with message, update group w/ number
    // indicating the # of unread messages)
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
</style>
