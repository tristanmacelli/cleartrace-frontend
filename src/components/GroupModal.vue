<template>
  <Modal Description=" " @hide-modal="$emit('hideModal')">
    <form
      v-on:submit.prevent="GroupAction"
      accept-charset="UTF-8"
      class="grid gap-y-2 w-full"
    >
      <!-- This slot allows for a Update Group modal -->
      <input
        v-if="this.type === 'update'"
        class="w-full p-2 border border-solid border-gray-200 focus:outline-none shadow-inner rounded-md"
        v-model="query"
        type="text"
        :placeholder="this.groupTitle"
      />
      <input
        v-if="this.type === 'update'"
        class="w-full p-2 border border-solid border-gray-200 focus:outline-none shadow-inner rounded-md"
        v-model="query"
        type="text"
        :placeholder="this.groupDescription"
      />
      <input
        class="w-full p-2 border border-solid border-gray-200 focus:outline-none shadow-inner rounded-md"
        v-model="query"
        type="text"
        placeholder="Search for a Friend!"
      />
      <h4 class="font-bold h-8 text-center">Members:</h4>
      <div class="flex flex-wrap gap-y-1 max-h-32 overflow-y-auto">
        <group-member
          v-for="(name, index) in names"
          :key="index"
          :name="name"
          @remove="names.splice(index, 1)"
        >
        </group-member>
      </div>
      <input
        class="w-full px-16 py-2 bg-blue-500 font-bold text-white cursor-pointer rounded-md"
        type="submit"
        :value="this.type"
      />
      <!-- This slot allows for a Update Group modal (Delete group button here) -->
      <input
        v-if="this.type === 'update'"
        class="w-full px-16 py-2 bg-red-500 font-bold text-white cursor-pointer rounded-md"
        type="button"
        :value="this.type"
      />
    </form>
    <list
      class="overflow-y-auto"
      @active-list-item="this.HandleListItem"
      v-if="this.showResults"
      :positionRight="false"
      :items="this.searchResults"
    >
    </list>
  </Modal>
</template>

<script>
import axios from "axios";
// @ is an alias to /src
import List from "@/components/List.vue";
import GroupMember from "@/components/GroupMember.vue";
import Modal from "@/components/Modal.vue";

export default {
  name: "groupModal",
  components: {
    List,
    GroupMember,
    Modal
  },
  props: {
    type: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      awaitingSearch: false,
      groupDescription: "",
      groupTitle: "",
      members: [],
      names: [],
      query: "",
      searchResults: [],
      showResults: false
    };
  },
  computed: {
    storedUserID() {
      return this.$store.getters.getUserID;
    }
  },
  emits: ["updateGroup", "hideModal"],
  watch: {
    query() {
      if (!this.awaitingSearch) {
        setTimeout(() => {
          this.SearchUsers();
          this.awaitingSearch = false;
        }, 1000); // 1 sec delay
      }
      this.awaitingSearch = true;
    }
  },
  methods: {
    CreateGroup() {
      if (this.members.length() == 0) {
        alert("Error: Invalid New Group Input");
        return;
      }
      let url = "https://slack.api.tristanmacelli.com/v1/channels";
      let sessionToken = localStorage.getItem("auth");
      let title = this.names.toString();
      let date = new Date();
      title = title.substring(1, title.length - 2);
      // Create Group object
      let groupObject = {
        name: title,
        description: "*~Enter a description~*",
        private: true,
        members: this.members,
        createdAt: date,
        editedAt: null
      };
      this.messageList.push(groupObject);
      axios
        .post(url, groupObject, {
          headers: {
            Authorization: sessionToken
          }
        })
        .catch(error => {
          alert(error);
        })
        .then(response => {
          console.log(response);
        });
    },
    DisplayResults() {
      this.showResults = true;
    },
    HideResults() {
      this.showResults = false;
    },
    GroupAction() {
      if (this.type === "Create") {
        this.CreateGroup();
        // Update
      } else {
        this.UpdateGroup();
      }
    },
    HandleListItem(index) {
      this.HideResults();
      // Grab the user associated with this item
      console.log(index);
      let newMember = this.searchResults[index];
      console.log(newMember);
      // Add this user to the list
      this.members.push(newMember.id);
      this.names.push(newMember.text);
    },
    SearchUsers() {
      // Do not query the backend if there is nothing to querys
      if (this.query.length == 0) {
        // Clear results when there is no query
        this.searchResults = [];
        return;
      }
      // Clear results on a new search
      this.searchResults = [];
      this.DisplayResults();
      // Show a loading animation component/svg
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
          if (response.data) {
            users
              .slice()
              .reverse()
              .forEach(user => {
                console.log(user);
                if (user.ID != this.storedUserID) {
                  let reducedUsr = {
                    id: user.ID,
                    text: user.FirstName + " " + user.LastName,
                    img: user.PhotoURL
                  };
                  this.searchResults.push(reducedUsr);
                }
              });
            if (this.searchResults.length > 0) {
              // Hide loading animation component
            }
            return;
          }
          // Hide results list if there are no results
          this.HideResults();
        });
    },
    DeleteGroup() {
      // DELETE channel from https://slack.api.tristanmacelli.com/v1/channels/:channelID
    },
    UpdateGroup() {
      // if (groupTitle || groupDescription changed) {
      //    PATCH updates to https://slack.api.tristanmacelli.com/v1/channels/:channelID
      // } else if (members increased) {
      //    POST members to https://slack.api.tristanmacelli.com/v1/channels/:channelID/members
      // }
      // } else if (members decreased) {
      //    DELETE members from https://slack.api.tristanmacelli.com/v1/channels/:channelID/members
      // }
      // Updates the group based on forms
    }
  }
};
</script>
