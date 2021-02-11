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
      Title="New Group"
      Description=" "
      v-if="this.displayCreate"
      @hide-modal="this.HideModal"
    >
      <form
        v-on:submit.prevent="CreateGroup"
        accept-charset="UTF-8"
        class="grid grid-rows-3 gap-y-2 w-full"
      >
        <input
          class="w-full p-2 border border-solid border-gray-200 focus:outline-none shadow-inner rounded-md"
          v-model="query"
          type="text"
          placeholder="*Members*"
        />
        <input
          class="w-full px-16 py-2 bg-blue-500 font-bold text-white cursor-pointer rounded-md"
          type="submit"
          value="Create"
        />
      </form>
    </Modal>
  </div>
</template>

<script>
import axios from "axios";
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
      displayCreate: false,
      members: [],
      searchResults: [],
      query: ""
    };
  },
  watch: {
    query() {
      this.SearchUsers();
    }
  },
  methods: {
    CreateGroup() {
      let url = "https://slack.api.tristanmacelli.com/v1/channels";
      let title = this.members.toString();
      if (this.members.length() == 0) {
        alert("Error: Invalid New Group Input");
        return;
      }
      axios
        .post(url, {
          name: title,
          description: "[Enter a description]",
          private: true,
          members: this.members,
          createdAt: null,
          editedAt: null
        })
        .catch(error => {
          alert(error);
        })
        .then(response => {
          console.log(response);
        });
    },
    SearchUsers() {
      if (this.query.length == 0) {
        return;
      }
      let url =
        "https://slack.api.tristanmacelli.com/v1/users/search/?q=" + this.query;
      let sessionToken = localStorage.getItem("auth");

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
          // console.log(response.data);
          let users = response.data;
          users
            .slice()
            .reverse()
            .forEach(user => {
              console.log(user);
              this.searchResults.push(user);
            });
        });
      // console.log(this.members.toString());
    },
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
