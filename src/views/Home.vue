<template>
  <div
    id="home"
    class="h-screen w-screen bg-cover flex flex-nowrap items-center justify-center"
  >
    <div class="w-screen h-screen">
      <MessageList></MessageList>
      <GroupList @display-create="this.DisplayCreate"></GroupList>
    </div>
    <Modal
      Title="Create New Group"
      Description="Create a new group to chat with friends!"
      v-if="this.displayCreate"
      @hide-modal="this.HideModal"
    ></Modal>
  </div>
</template>

<script>
// @ is an alias to /src
import MessageList from "@/components/MessageList.vue";
import GroupList from "@/components/GroupList.vue";
import Modal from "@/components/Modal.vue";

export default {
  name: "Home",
  components: {
    MessageList,
    GroupList,
    Modal
  },
  data() {
    return {
      displayCreate: false
    };
  },
  methods: {
    DisplayCreate() {
      this.displayCreate = true;
    },
    HideModal() {
      this.displayCreate = false;
    }
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
