<template>
  <div
    id="messageList"
    class="flex flex-col absolute z-10 w-full sm:w-4/5 h-full border-r border-gray-300"
  >
    <div class="flex no-wrap h-20 px-5 py-6">
      <p class="flex-grow font-semibold text-lg">
        {{ this.storedGroupName }}
      </p>
      <svg
        class="sm:hidden"
        @click="this.OpenGroupList"
        height="28px"
        id="Layer_1"
        style="enable-background: new 0 0 28 28"
        version="1.1"
        viewBox="0 0 28 28"
        width="28px"
        xml:space="preserve"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
      >
        <path
          d="M4,10h24c1.104,0,2-0.896,2-2s-0.896-2-2-2H4C2.896,6,2,6.896,2,8S2.896,10,4,10z M28,14H4c-1.104,0-2,0.896-2,2  s0.896,2,2,2h24c1.104,0,2-0.896,2-2S29.104,14,28,14z M28,22H4c-1.104,0-2,0.896-2,2s0.896,2,2,2h24c1.104,0,2-0.896,2-2  S29.104,22,28,22z"
        />
      </svg>
    </div>
    <div
      id="view-messages"
      class="grid grid-flow-row auto-rows-max flex-grow pt-4 px-2 sm:px-4 pb-0 bg-white overflow-y-auto"
    >
      <message
        v-for="(msg, index) in messageList"
        :message="msg"
        :key="msg.id"
        :id="msg.id"
        :body="msg.body"
        :creator="msg.creator"
        :createdAt="msg.createdAt"
        @remove="todos.splice(index, 1)"
      ></message>
    </div>
    <div class="w-full h-12 sm:h-14 bg-white p-3">
      <form
        v-on:submit.prevent="SendMessage"
        accept-charset="UTF-8"
        class="flex no-wrap"
      >
        <input
          class="flex-grow h-8 pl-3 pt-1 bg-gray-200 focus:outline-none rounded-2xl"
          id="messageBody"
          v-model="newBody"
          type="text"
          placeholder="Type a message..."
        />
        <input
          class="arrow w-6 h-5 mx-4 cursor-pointer self-center"
          :disabled="disableSendMessage"
          type="submit"
          value=" "
        />
      </form>
    </div>
  </div>
</template>

<script>
import axios from "axios";
import Message from "./Message.vue";

export default {
  name: "messageList",
  components: {
    Message
  },
  data() {
    return {
      groupID: this.storedGroupID,
      newBody: "",
      messageList: []
    };
  },
  computed: {
    storedGroupID() {
      return this.$store.getters.getGroupID;
    },
    storedGroupName() {
      return this.$store.getters.getGroupName;
    },
    disableSendMessage() {
      return this.newBody.length == 0;
    },
    storedSocket() {
      return this.$store.getters.getSocket;
    },
    storedUser() {
      return this.$store.getters.getUser;
    }
  },
  watch: {
    groupID: async function() {
      await this.GetMessages();
    }
  },
  created: async function() {
    // Create initial message
    let date = new Date();
    date = this.formatDate(date);
    let welcomeMessage = {
      id: "-1",
      body: "Welcome to the " + this.storedGroupName + " group",
      creator: {
        FirstName: "Automated",
        LastName: ""
      },
      createdAt: date
    };
    this.messageList.push(welcomeMessage);

    // Make query to server for last 100 messages
    await this.GetMessages();

    this.storedSocket.onmessage = event => {
      console.log("Message Received!");
      // The data we created is in the event.data field
      // The current datatype of event is message
      let receivedObj = JSON.parse(event.data);
      let messageObj = receivedObj.message;

      if (receivedObj.type == "message-new") {
        // This is the "default behavior" when the user is viewing the group
        // that messages are coming in on
        if (messageObj.channelID == this.storedGroupID) {
          let message = this.PreprocessMessage(messageObj);
          this.messageList.push(message);
        }
      }
    };
  },
  methods: {
    async GetMessages() {
      var url =
        "https://slack.api.tristanmacelli.com/v1/channels/" +
        this.storedGroupID;
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
          let messages = response.data;
          messages
            .slice()
            .reverse()
            .forEach(message => {
              message = this.PreprocessMessage(message);
              this.messageList.push(message);
            });
          this.updateScroll();
        });
    },
    async SendMessage() {
      var url =
        "https://slack.api.tristanmacelli.com/v1/channels/" +
        this.storedGroupID;
      let sessionToken = localStorage.getItem("auth");

      // Get user first name from store & add it to this object
      let date = new Date();
      let formattedDate = this.formatDate(date);
      let messageObject = {
        channelID: this.storedGroupID,
        body: this.newBody,
        createdAt: formattedDate,
        creator: this.storedUser
      };
      this.messageList.push(messageObject);

      // send a get request with the above data
      axios
        .post(url, messageObject, {
          headers: {
            Authorization: sessionToken
          }
        })
        .catch(error => {
          alert(error);
        })
        .then(() => {
          this.newBody = "";
          this.updateScroll();
        });
    },
    OpenGroupList() {
      // Transition #groupList to the right
      if (this.$store.getters.getIsMobile) {
        this.$store.commit("setIsGroupListOpen");
      }
    },
    updateScroll() {
      let element = document.getElementById("view-messages");
      element.scrollTop = element.scrollHeight;
    },
    PreprocessMessage(message) {
      let newCreatedAt = new Date(message.createdAt);
      message.createdAt = this.formatDate(newCreatedAt);
      return message;
    },
    formatDate(date) {
      let dd = "AM";
      let hh = date.getHours();
      let m = date.getMinutes();
      let h = hh;
      if (hh >= 12) {
        h = hh - 12;
        dd = "PM";
      }
      if (h == 0) {
        h = 12;
      }
      h = h < 10 ? "0" + h : h;
      m = m < 10 ? "0" + m : m;
      return h + ":" + m + " " + dd;
    }
  }
};
</script>

<style>
.arrow {
  /* https://www.flaticon.com/free-icon/right-arrow_724954?term=send&page=1&position=19 */
  background: url("../assets/send.svg") no-repeat;
}
</style>
