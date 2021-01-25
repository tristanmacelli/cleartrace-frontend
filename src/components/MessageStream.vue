<template>
  <div id="messageStream">
    <div id="view-messages">
      <message
        v-for="msg in messageStream"
        :message="msg"
        :key="msg.id"
        :id="msg.id"
        :body="msg.body"
        :creator="msg.creator"
        :createdAt="msg.createdAt"
      ></message>
    </div>
    <div id="send-message">
      <form v-on:submit.prevent="SendMessage" accept-charset="UTF-8">
        <table cellspacing="0" role="presentation">
          <tbody>
            <tr>
              <td>
                <input
                  id="messageBody"
                  v-model="newBody"
                  type="text"
                  placeholder="Type a message..."
                />
              </td>
              <td>
                <input
                  id="sendMsgBtn"
                  :disabled="disableSendMessage"
                  type="submit"
                  value=""
                />
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  </div>
</template>

<script>
import Message from "./Message.vue";

export default {
  name: "messageStream",
  components: {
    Message
  },
  data() {
    return {
      channelID: this.storedChannelID,
      newBody: "",
      messageStream: []
    };
  },
  computed: {
    storedChannelID() {
      return this.$store.getters.getChannelID;
    },
    storedChannelName() {
      return this.$store.getters.getChannelName;
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
    channelID: async function() {
      await this.GetMessages();
    }
  },
  created: async function() {
    // Create initial message
    let date = new Date();
    date = this.formatDate(date);
    let welcomeMessage = {
      id: "-1",
      body: "Welcome to the " + this.storedChannelName + " channel",
      creator: {
        FirstName: "Automated",
        LastName: ""
      },
      createdAt: date
    };
    this.messageStream.push(welcomeMessage);

    // Make query to server for last 100 messages
    await this.GetMessages();

    this.storedSocket.onmessage = event => {
      console.log("Message Received!");
      // The data we created is in the event.data field
      // The current datatype of event is message
      let receivedObj = JSON.parse(event.data);
      let messageObj = receivedObj.message;

      if (receivedObj.type == "message-new") {
        // This is the "default behavior" when the user is viewing the channel
        // that messages are coming in on
        if (messageObj.channelID == this.storedChannelID) {
          let message = this.PreprocessMessage(messageObj);
          this.messageStream.push(message);
        }
      }
    };
  },
  methods: {
    async GetMessages() {
      var url =
        "https://slack.api.tristanmacelli.com/v1/channels/" +
        this.storedChannelID;
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
          this.messageStream.push(message);
        });
      this.updateScroll();
    },
    async SendMessage() {
      var url =
        "https://slack.api.tristanmacelli.com/v1/channels/" +
        this.storedChannelID;
      let sessionToken = localStorage.getItem("auth");

      // Get user first name from store & add it to this object
      let date = new Date();
      let formattedDate = this.formatDate(date);
      let requestBody = {
        channelID: this.storedChannelID,
        creator: this.storedUser,
        body: this.newBody,
        createdAt: formattedDate
      };
      this.messageStream.push(requestBody);

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

<style>
#messageStream {
  width: 66vw;
  background-color: lightsteelblue;
  border-radius: 2px;
  float: left;
}

#view-messages {
  padding: 2em;
  overflow: scroll;
  height: 70vh;
}

#send-message {
  padding: 0.75em;
  background-color: #e9ebee;
  max-height: 10vh;
  border: slategrey;
  border-radius: 4px;
  border-style: solid;
  border-width: 0.05em;
}

#messageBody {
  width: 60vw;
}

#sendMsgBtn {
  /* https://www.flaticon.com/free-icon/right-arrow_724954?term=send&page=1&position=19 */
  background: url("../assets/send.svg") no-repeat;
  background-position: center center;
  border-radius: 2px;
  border: 0;
  padding: 0.25em 2em;
  cursor: pointer;
}
</style>
