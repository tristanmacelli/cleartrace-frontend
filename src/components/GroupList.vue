<template>
  <!-- https://dev.to/fayaz/making-a-navigation-drawer-sliding-sidebar-with-tailwindcss-blueprint-581l -->
  <div
    id="groupList"
    class="absolute sm:right-0 z-20 w-full sm:w-1/4 h-screen px-4 py-4 transform ease-in-out transition-all duration-300 bg-white"
    :class="this.storedIsGroupListOpen ? 'translate-x-0' : 'translate-x-full'"
  >
    <div class="flex no-wrap mb-10">
      <p class="mr-1.5 pt-1.5 px-1 bg-gray-200 rounded-3xl">
        {{ this.storedUserInitials }}
      </p>
      <h3 class="flex-grow text-2xl">Conversations</h3>
      <Dropdown>
        <DropdownItem @click="this.AlertUnregistered">Profile</DropdownItem>
        <DropdownItem @click="this.AlertUnregistered">Settings</DropdownItem>
        <DropdownItem @click="this.SignOut">Sign Out</DropdownItem>
      </Dropdown>
    </div>
    <group
      @click="this.CloseGroupList"
      v-for="grp in groups"
      :group="grp"
      :key="grp.id"
      :id="grp.id"
      :name="grp.name"
    ></group>
  </div>
</template>

<script>
import Group from "./Group.vue";
import Dropdown from "./Dropdown.vue";
import DropdownItem from "./DropdownItem.vue";
import axios from "axios";

export default {
  name: "groupList",
  data() {
    return {
      groups: [],
      width: 0
    };
  },
  components: {
    Group,
    Dropdown,
    DropdownItem
  },
  computed: {
    storedUserInitials() {
      return this.$store.getters.getUserInitials;
    },
    storedSocket() {
      return this.$store.getters.getSocket;
    },
    storedIsGroupListOpen() {
      return this.$store.getters.getIsGroupListOpen;
    },
    storedIsMobile() {
      return this.$store.getters.getIsMobile;
    }
  },
  created: async function() {
    this.width = window.innerWidth;
    await this.GetGroups();
    // storedSocket.onmessage = event => {
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
      if (this.storedIsMobile) {
        this.$store.commit("clearIsGroupListOpen");
      }
    },
    async GetGroups() {
      var url = "https://slack.api.tristanmacelli.com/v1/channels";
      let sessionToken = localStorage.getItem("auth");

      // send a get request with the above data
      axios
        .get(url, {
          headers: {
            Authorization: sessionToken
          }
        })
        .catch(error => {
          alert(error);
        })
        .then(response => {
          let groups = response.data;
          groups
            .slice()
            .reverse()
            .forEach(group => {
              this.groups.push(group);
            });
        });
    },
    async SignOut() {
      let url = "https://slack.api.tristanmacelli.com/v1/sessions/mine";
      let sessionToken = localStorage.getItem("auth");

      // send a DELETE request with the above data
      axios
        .delete(url, {
          headers: {
            Authorization: sessionToken
          }
        })
        .catch(error => {
          alert(error);
        })
        .then(() => {
          localStorage.removeItem("auth");
          this.$store.commit("clearAuthentication");
          this.$store.commit("clearSocket");
          if (this.$router.currentRoute != "/") {
            this.$router.push({ path: "/" });
          }
        });
    }
  }
};
</script>
