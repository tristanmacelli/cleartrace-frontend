<template>
  <div
    id="groupList"
    class="absolute sm:right-0 z-20 w-full sm:w-1/4 h-screen px-4 py-4 transform ease-in-out transition-all duration-300 bg-white"
    :class="this.storedIsGroupListOpen ? 'translate-x-0' : 'translate-x-full'"
  >
    <div class="flex no-wrap mb-10">
      <h3 class="flex-grow text-2xl">
        Conversations
      </h3>
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
      this.groups = [];
      var url = "https://slack.api.tristanmacelli.com/v1/channels";
      let sessionToken = localStorage.getItem("auth");

      // send a get request with the above data
      let resp = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: sessionToken
        }
      });
      if (!resp.ok) {
        alert(resp.status);
        throw new Error(resp.status.toString());
      }
      let groups = await resp.json();
      groups
        .slice()
        .reverse()
        .forEach(group => {
          this.groups.push(group);
        });
    },
    async SignOut() {
      let url = "https://slack.api.tristanmacelli.com/v1/sessions/mine";
      let sessionToken = localStorage.getItem("auth");

      // send a get request with the above data
      let resp = await fetch(url, {
        method: "DELETE",
        headers: {
          Authorization: sessionToken
        }
      });
      if (!resp.ok) {
        let message = "Error: " + resp.status.toString();
        alert(message);
      }

      localStorage.removeItem("auth");
      this.$store.commit("clearAuthentication");
      this.$store.commit("clearSocket");
      if (this.$router.currentRoute != "/") {
        this.$router.push({ path: "/" });
      }
    }
  }
};
</script>
