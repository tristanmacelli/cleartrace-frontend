<template>
  <div id="messageList" class="w-3/4 h-full border-r border-gray-300">
    <div class="h-20 p-10 grid content-center">
      <p class="font-semibold text-lg">{{ this.storedGroupName }}</p>
    </div>
    <div
      id="view-messages"
      style="height: 86%;"
      class="h-full p-8 pb-0 bg-white overflow-y-auto"
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
    <div class="w-full h-14 bg-white p-3">
      <form
        v-on:submit.prevent="SendMessage"
        accept-charset="UTF-8"
        class="flex no-wrap"
      >
        <input
          class="flex-grow h-8 pl-3 pt-1 bg-gray-200 rounded-2xl"
          id="messageBody"
          v-model="newBody"
          type="text"
          placeholder="Type a message..."
        />
        <!-- https://www.flaticon.com/free-icon/right-arrow_724954?term=send&page=1&position=19 -->
        <input
          class="w-min h-5 py-1 px-8 cursor-pointer bg-center"
          style="background:url('../assets/send.svg') no-repeat"
          :disabled="disableSendMessage"
          type="submit"
          value=" "
        />
      </form>
    </div>
  </div>
</template>

<script>
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
        if (messageObj.groupID == this.storedGroupID) {
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
      let resp = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: sessionToken
        }
      });
      if (!resp.ok) {
        alert("Error: ", resp.status);
      }
      let messages = await resp.json();
      messages
        .slice()
        .reverse()
        .forEach(message => {
          message = this.PreprocessMessage(message);
          this.messageList.push(message);
        });
      this.updateScroll();
    },
    async SendMessage() {
      var url =
        "https://slack.api.tristanmacelli.com/v1/channels/" +
        this.storedGroupID;
      let sessionToken = localStorage.getItem("auth");

      // Get user first name from store & add it to this object
      let date = new Date();
      let formattedDate = this.formatDate(date);
      let requestBody = {
        channelID: this.storedGroupID,
        creator: this.storedUser,
        body: this.newBody,
        createdAt: formattedDate
      };
      this.messageList.push(requestBody);

      // send a get request with the above data
      let resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: sessionToken
        },
        body: JSON.stringify(requestBody)
      });
      if (!resp.ok) {
        alert("Error: ", resp.status);
      }
      this.newBody = "";
      this.updateScroll();
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
