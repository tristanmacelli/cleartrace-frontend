<template>
  <div id="groupList" class="w-1/4 px-4 py-4 bg-white">
    <div class="flex no-wrap mb-10">
      <h3 class="flex-grow text-2xl">
        Conversations
      </h3>
      <button
        @click="SignOut"
        class="font-bold text-lg px-2 py-0.5 rounded-3xl bg-gray-200 hover:bg-gray-300"
      >
        ...
      </button>
    </div>
    <group
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

export default {
  name: "groupList",
  data() {
    return {
      groups: []
    };
  },
  components: {
    Group
  },
  computed: {
    storedSocket() {
      return this.$store.getters.getSocket;
    }
  },
  created: async function() {
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

<style>
#groupList {
  height: 100vh;
  float: left;
}
</style>
