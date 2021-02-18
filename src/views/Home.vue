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
          placeholder="Add a member!"
        />
        <member
          v-for="(name, index) in names"
          :key="index"
          :name="name"
          @remove="names.splice(index, 1)"
        >
        </member>
        <input
          class="w-full px-16 py-2 bg-blue-500 font-bold text-white cursor-pointer rounded-md"
          type="submit"
          value="Create"
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
  </div>
</template>

<script>
import axios from "axios";
// @ is an alias to /src
import List from "@/components/List.vue";
import Member from "@/components/Member.vue";
import MessageList from "@/components/MessageList.vue";
import Modal from "@/components/Modal.vue";
import GroupList from "@/components/GroupList.vue";

export default {
  name: "Home",
  components: {
    List,
    Member,
    MessageList,
    Modal,
    GroupList
  },
  data() {
    return {
      awaitingSearch: false,
      displayCreate: false,
      members: [],
      names: [],
      query: "",
      searchResults: [],
      showResults: false
    };
  },
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
  computed: {
    storedUserID() {
      return this.$store.getters.getUserID;
    }
  },
  methods: {
    CreateGroup() {
      let url = "https://slack.api.tristanmacelli.com/v1/channels";
      let title = this.names.toString();
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
    DisplayResults() {
      this.showResults = true;
    },
    HideResults() {
      this.showResults = false;
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
  }
};
</script>
