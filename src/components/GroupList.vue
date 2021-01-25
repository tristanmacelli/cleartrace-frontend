<template>
  <div id="groupList">
    <h3>
      Your Groups:
    </h3>
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
    }
  }
};
</script>

<style>
#groupList {
  height: 88vh;
  width: 30vw;
  padding: 0 2em;
  float: left;
  overflow: scroll;
}
</style>
