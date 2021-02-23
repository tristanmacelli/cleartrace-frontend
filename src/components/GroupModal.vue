<template>
  <Modal :Title="this.title" Description=" " @hide-modal="HideModal">
    <form
      v-on:submit.prevent="CreateGroup"
      accept-charset="UTF-8"
      class="grid gap-y-2 w-full"
    >
      <!-- This slot allows for a Update Group modal -->
      <input
        v-if="this.type === 'update'"
        class="w-full p-2 border border-solid border-gray-200 focus:outline-none shadow-inner rounded-md"
        v-model="name"
        type="text"
      />
      <input
        v-if="this.type === 'update'"
        class="w-full p-2 border border-solid border-gray-200 focus:outline-none shadow-inner rounded-md"
        v-model="description"
        type="text"
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
          :index="index"
          :name="name"
          @remove="this.RemoveGroupMember"
        >
        </group-member>
      </div>
      <input
        v-if="this.type === 'create'"
        class="w-full px-16 py-2 bg-blue-500 font-bold text-white cursor-pointer rounded-md"
        type="submit"
        value="Create"
      />
      <!-- This slot allows for a Update Group modal (Delete group button here) -->
      <input
        v-if="this.type === 'update'"
        @click="DeleteGroup"
        class="w-full px-16 py-2 bg-red-500 font-bold text-white cursor-pointer rounded-md"
        type="button"
        value="Delete"
      />
    </form>
    <list
      class="overflow-y-auto"
      @active-list-item="this.AddGroupMember"
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
import { mapState } from "vuex";

export default {
  name: "groupModal",
  components: {
    List,
    GroupMember,
    Modal
  },
  props: {
    group: {
      type: Object,
      required: false
    },
    type: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      awaitingSearch: false,
      awaitingDescription: false,
      awaitingTitle: false,
      description: "",
      members: [],
      name: "",
      names: [],
      query: "",
      searchResults: [],
      showResults: false,
      title: this.type === "update" ? "Update " + this.group.name : "New Group"
    };
  },
  computed: mapState({
    general: state => state.general,
    groupID: state => state.group.id,
    serverURL: state => state.serverURL,
    userID: state => state.user.id,
    membersLength: this.memebers.length
  }),
  emits: ["createGroup", "updateGroup", "hideModal"],
  watch: {
    query() {
      if (!this.awaitingSearch) {
        setTimeout(() => {
          this.SearchUsers();
          this.awaitingSearch = false;
        }, 1000); // 1 sec delay
      }
      this.awaitingSearch = true;
    },
    description(_, oldVal) {
      if (this.type == "update") {
        if (oldVal !== "") {
          if (!this.awaitingDescription) {
            setTimeout(() => {
              this.UpdateGroupDetails();
              this.awaitingDescription = false;
            }, 1000); // 1 sec delay
          }
          this.awaitingDescription = true;
        }
      }
    },
    name(_, oldVal) {
      if (this.type == "update") {
        if (oldVal !== "") {
          if (!this.awaitingTitle) {
            setTimeout(() => {
              this.UpdateGroupDetails();
              this.awaitingTitle = false;
            }, 1000); // 1 sec delay
          }
          this.awaitingTitle = true;
        }
      }
    }
  },
  created: function() {
    if (this.type === "update") {
      this.name = this.group.name;
      this.description = this.group.description;
      // TODO: Check that the order of indexing of members and names lines up
      //       in after initializing them here
      console.log("member ids");
      this.group.members
        .slice()
        .reverse()
        .forEach(member => {
          console.log(member);
          this.groups.push(member);
        });
      let url = this.serverURL + "v1/users/search/";
      let sessionToken = localStorage.getItem("auth");
      console.log("user ids for fullnames");
      axios
        .post(url, this.group.members, {
          headers: {
            Authorization: sessionToken
          }
        })
        .catch(error => {
          alert(error);
        })
        .then(response => {
          if (users == null) {
            return;
          }
          let users = response.data;
          users
            .slice()
            .reverse()
            .forEach(user => {
              console.log(user.ID);
              let fullname = user.FirstName + " " + user.LastName;
              this.names.push(fullname);
            });
        });
    }
  },
  methods: {
    CreateGroup() {
      if (this.members.length == 0) {
        alert("Error: Invalid New Group Input");
        return;
      }
      let url = this.serverURL + "v1/channels";
      let sessionToken = localStorage.getItem("auth");
      let title = this.names.toString();
      let date = new Date();
      // title = title.substring(1, title.length - 2);
      // Create Group object
      let groupObject = {
        name: title,
        description: "*~Enter a description~*",
        private: true,
        members: this.members,
        createdAt: date,
        editedAt: null
      };
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
          // This should be the newly created channel w/ id
          console.log(response.data);
          let newGroup = response.data;
          // Done in then to ensure backend generated id is correct
          this.$emit("setGroup", newGroup);
          this.HideModal();
          // to ensure user is up to date
          this.GetMessages();
        });
    },
    DisplayResults() {
      this.showResults = true;
    },
    HideResults() {
      this.showResults = false;
    },
    HideModal() {
      this.$emit("hideModal");
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
      let url = this.serverURL + "v1/users/search/?q=" + this.query;
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
                if (user.ID != this.userID) {
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
      let url = this.serverURL + "v1/channels/" + this.groupID;
      let sessionToken = localStorage.getItem("auth");
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
          // Go back to the general group when deleting the channel
          this.$emit("setGroup", this.general);
          this.HideModal();
        });
    },
    UpdateGroupDetails() {
      // Update name & description
      let url = this.serverURL + "v1/channels/" + this.groupID;
      let sessionToken = localStorage.getItem("auth");
      let body = {
        name: this.name,
        description: this.description
      };

      axios
        .patch(url, body, {
          headers: {
            Authorization: sessionToken
          }
        })
        .catch(error => {
          console.log(error);
          alert(error);
        })
        .then(response => {
          console.log("Updating group details");
          this.$emit("setGroup", response.data);
        });
    },
    AddGroupMember(index) {
      this.HideResults();
      let newMember = this.searchResults[index];
      console.log(index);
      console.log(newMember);
      if (this.type === "create") {
        this.members.push(newMember.id);
        this.names.push(newMember.text);
        return;
      }

      let url = this.serverURL + "v1/channels/" + this.groupID + "/members";
      let sessionToken = localStorage.getItem("auth");
      axios
        .post(url, newMember.id, {
          headers: {
            Authorization: sessionToken
          }
        })
        .catch(error => {
          alert(error);
        })
        .then(response => {
          let updatedGroup = response.data;
          this.members.push(newMember.id);
          this.names.push(newMember.text);
          this.$emit("setGroup", updatedGroup);
        });
    },
    RemoveGroupMember(index) {
      let id = this.members[index];
      if (this.type === "create") {
        console.log(this.names[index]);
        console.log(this.members[index]);
        this.names.splice(index, 1);
        this.members.splice(index, 1);
        return;
      }

      // Parse members & add them to new group obj before sending request
      let url = this.serverURL + "v1/channels/" + this.groupID + "/members";
      let sessionToken = localStorage.getItem("auth");
      axios
        .delete(url, id, {
          headers: {
            Authorization: sessionToken
          }
        })
        .catch(error => {
          alert(error);
        })
        .then(response => {
          this.names.splice(index, 1);
          this.members.splice(index, 1);
          this.$emit("setGroup", response.data);
        });
    }
  }
};
</script>
