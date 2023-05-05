<template>
  <!-- https://dev.to/fayaz/making-a-navigation-drawer-sliding-sidebar-with-tailwindcss-blueprint-581l -->
  <div
    id="groupList"
    class="absolute sm:right-0 z-20 w-full sm:w-1/5 h-screen transform ease-in-out transition-all duration-300 bg-white"
    :class="
      this.isGroupListOpen
        ? 'translate-x-0 show-groups-list'
        : 'translate-x-full hide-groups-list'
    "
  >
    <!-- TheRightMenu.vue -->
    <div class="flex no-wrap items-center px-2 h-20">
      <p class="h-8 mx-1.5 pt-1.5 px-1 bg-gray-200 rounded-3xl">
        {{ this.initials }}
      </p>
      <h3 class="flex-grow text-2xl">Conversations</h3>
      <button
        class="h-8 mx-1.5 rounded-3xl bg-gray-200 hover:bg-gray-300 focus:outline-none"
        @click="this.DisplayModalCreate"
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
          @active-list-item="this.HandleListItem"
          positionRight
          :items="this.listItems"
        ></list>
      </Dropdown>
    </div>
    <!-- TheGroupList.vue -->
    <div class="px-2">
      <group
        @click="this.CloseGroupList"
        @display-modal="this.DisplayModal"
        v-for="group in groups"
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

<script>
import Group from "./Group.vue";
import Dropdown from "./Dropdown.vue";
import List from "./List.vue";
import { useStore } from "vuex";
import { computed, ref } from "vue";
import { Users } from "@/api/users";
import { Groups } from "@/api/messaging.service";

export default {
  name: "groupList",
  components: {
    Group,
    Dropdown,
    List,
  },
  async setup() {
    const store = useStore();
    const { groups, GetGroups } = Groups();
    const { SignOut } = Users();

    const listItems = ref([]);
    const width = ref(0);
    const isGroupListOpen = computed(() => store.state.isGroupListOpen);
    const isMobile = computed(() => store.state.isMobile);
    const initials = computed(() => store.getters.getUserInitials);

    let items = ["Profile", "Settings", "Sign Out"];
    items.forEach((item, index) =>
      listItems.value.push({ id: index, text: item })
    );
    width.value = window.innerWidth;
    await GetGroups();

    return {
      initials,
      isGroupListOpen,
      isMobile,
      groups,
      listItems,
      GetGroups,
      SignOut,
    };
  },
  emits: ["displayModal"],
  beforeMount: async () => {
    // this.socket.onmessage = event => {
    //   // The data we created is in the event.data field
    //   // The current datatype of event is message
    //   let receivedObj = JSON.parse(event.data);
    //   let messageObj = receivedObj.message;
    //   if (receivedObj.type == "message-new") {
    //     if (messageObj.groupID != this.GroupID) {
    //       // Send a notification (noise, highlight group with message, update group w/ number
    //       //                      indicating the # of unread messages)
    //     }
    //   }
    // };
  },
  methods: {
    AlertUnregistered() {
      confirm("We're sorry but this feature is still under development :(");
    },
    CloseGroupList() {
      // Transition #groupList to the right
      if (this.isMobile) {
        this.$store.commit("clearIsGroupListOpen");
      }
    },
    DisplayModalCreate() {
      let newBuffer = {
        group: null,
        type: "create",
      };
      this.$store.commit("setgroupModalData", {
        groupModalData: newBuffer,
      });
      this.DisplayModal();
    },
    DisplayModal() {
      this.$emit("displayModal");
    },
    async HandleListItem(item) {
      if (item.id == 2) {
        this.SignOut();
      } else {
        this.AlertUnregistered();
      }
    },
  },
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
