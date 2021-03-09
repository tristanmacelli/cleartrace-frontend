<template>
  <!-- https://dev.to/fayaz/making-a-navigation-drawer-sliding-sidebar-with-tailwindcss-blueprint-581l -->
  <div
    id="groupList"
    class="absolute sm:right-0 z-20 w-full sm:w-1/5 h-screen transform ease-in-out transition-all duration-300 bg-white"
    :class="this.isGroupListOpen ? 'translate-x-0' : 'translate-x-full'"
  >
    <div class="flex no-wrap px-4 pt-4 mb-10">
      <p class="mr-1.5 pt-1.5 px-1 bg-gray-200 rounded-3xl">
        {{ this.storedUserInitials }}
      </p>
      <h3 class="flex-grow text-2xl">Conversations</h3>
      <button
        class="mr-2 rounded-3xl bg-gray-200 hover:bg-gray-300 focus:outline-none"
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
    <div class="px-2">
      <group
        @click="this.CloseGroupList"
        @display-modal="this.DisplayModal"
        v-for="grp in groups"
        :key="grp.id"
        :creator="grp.creator"
        :description="grp.description"
        :id="grp.id"
        :members="grp.members"
        :name="grp.name"
      ></group>
    </div>
  </div>
</template>

<script>
import Group from "./Group.vue";
import Dropdown from "./Dropdown.vue";
import List from "./List.vue";
import { mapState } from "vuex";
import { Users } from "@/api/users";
import { Groups } from "@/api/users";

export default {
  name: "groupList",
  setup() {
    const { GetGroups } = Groups();
    const { SignOut } = Users();
    return {
      GetGroups,
      SignOut
    };
  },
  components: {
    Group,
    Dropdown,
    List
  },
  data() {
    return {
      groups: [],
      listItems: [],
      width: 0
    };
  },
  computed: {
    storedUserInitials() {
      return this.$store.getters.getUserInitials;
    },
    ...mapState({
      groupBuffer: state => state.groupBuffer,
      isGroupListOpen: state => state.isGroupListOpen,
      isMobile: state => state.isMobile,
      serverURL: state => state.serverURL
    })
  },
  watch: {
    groupBuffer() {
      // There aren't any changes to process when opening the group modal
      if (this.groupBuffer.showModal) {
        return;
      }
      // created groups are pushed to the group list immediately, increasing redundancy/reliability
      if (this.groupBuffer.type == "create") {
        this.groups.push(this.groupBuffer);
      }
      // In all cases, the groupList should be updated
      this.GetGroups();
      let newBuffer = {
        group: null,
        type: null,
        showModal: false
      };
      this.$store.commit("setGroupBuffer", {
        groupBuffer: newBuffer
      });
    }
  },
  emits: ["displayModal"],
  created: async function() {
    let items = ["Profile", "Settings", "Sign Out"];
    items.forEach((item, index) =>
      this.listItems.push({ id: index, text: item })
    );
    this.width = window.innerWidth;
    await this.GetGroups();
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
        showModal: true
      };
      this.$store.commit("setGroupBuffer", {
        groupBuffer: newBuffer
      });
      this.DisplayModal();
    },
    DisplayModal() {
      this.$emit("displayModal");
    },
    async HandleListItem(index) {
      if (index == 2) {
        this.SignOut();
      } else {
        this.AlertUnregistered();
      }
    }
  }
};
</script>
