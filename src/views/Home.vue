<template>
  <div id="home" class="main">
    <MessageStream></MessageStream>
    <GroupList></GroupList>
  </div>
</template>

<script>
// @ is an alias to /src
import MessageStream from "@/components/MessageStream.vue";
import GroupList from "@/components/GroupList.vue";

export default {
  name: "Home",
  components: {
    MessageStream,
    GroupList
  },
  created: function() {
    let sessionToken = localStorage.getItem("auth");
    if (!sessionToken) {
      this.$router.push({ path: "/" });
    }
    // Update data with the values in the store for currentGroupName/ID
    // if these values dont exist then execute the following:
    // this.GetSpecificGroup(this.currentGroupName);
    // this.handleConnectionCreation();
    // TODO: Figure out how to have multiple onmessage OR another structure of handling info
    // this.socket.onmessage = event => {
    //   // The data we created is in the event.data field
    //   // The current datatype of event is message
    //   let receivedObj = JSON.parse(event.data);
    //   let messageObj = receivedObj.message;
    //   let isCurrentGroup = messageObj.groupID == this.GroupID;

    //   if (receivedObj.type == "channel-new") {
    //     // Show modal with an option to navigate to the new Group
    //     // GetGroups() will be called from the Groups component
    //   }
    //   if (receivedObj.type == "channel-update") {
    //     // Show modal indicating there has been changes to a group name
    //     // GetGroups() will be called from the Groups component
    //   }
    //   if (receivedObj.type == "channel-delete" && isCurrentGroup) {
    //     // Show modal indicating the current group was deleted & that the user will be
    //     // navigated to the General group automatically after closing the modal
    //     // 1. Make current group id & name == General
    //     // 2. Call GetGroups in Groups component
    //   } else if (receivedObj.type == "channel-delete") {
    //     // Show modal indicating that a group was deleted & after closing the modal
    //     // GetGroups() will be called from the Groups component
    //   }
    // };
  }
};
</script>
