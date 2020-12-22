<template>
  <div id="messageStream">
    <div id="view-messages">
      <p
        is="message"
        v-for="message in messageStream"
        v-bind:key="message.body"
        v-bind:name="message.creator.FirstName + ' ' + message.creator.LastName"
        v-bind:date="message.createdAt"
        v-bind:body="message.body"
      ></p>
    </div>
    <div id="send-message">
      <form v-on:submit.prevent="SendMessage" accept-charset="UTF-8">
        <table cellspacing="0" role="presentation">
          <tbody>
            <tr>
              <td>
                <input
                  id="messageBody"
                  v-model="NewBody"
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
  props: {
    channelName: {
      type: String,
      required: true
    },
    channelID: {
      type: String,
      required: true
    },
    user: {
      type: Object,
      required: true
    }
  },
  components: {
    Message
  },
  data() {
    return {
      messageStream: [],
      NewBody: ""
    };
  },
  computed: {
    disableSendMessage() {
      return this.NewBody.length == 0;
    }
  },
  created: async function() {
    let date = new Date();
    date = this.formatDate(date);
    let welcomeMessage = {
      creator: {
        FirstName: "Automated",
        LastName: ""
      },
      body: "Welcome to the " + this.channelName + " channel",
      createdAt: date
    };
    this.messageStream.push(welcomeMessage);

    // Open websocket connection as soon as possible
    let sessionToken = localStorage.getItem("auth");
    const connection = new WebSocket(
      "wss://slack.api.tristanmacelli.com/v1/ws?auth=" + sessionToken
    );

    // Make query to server for last 100 messages
    await this.GetMessages();

    // The anonymous function is what allowed access to data/(props??)
    // https://redislabs.com/blog/how-to-create-notification-services-with-redis-websockets-and-vue-js/
    connection.onmessage = event => {
      // The data we created is in the event.data field
      // The current datatype of event is message
      let receivedObj = JSON.parse(event.data);
      let messageObj = receivedObj.message;

      if (receivedObj.type == "message-new") {
        // This is the "default behavior" when the user is viewing the channel
        // that messages are coming in on
        if (
          messageObj.channelID == this.channelID &&
          messageObj.creator.ID != this.user.ID
        ) {
          let message = this.PreprocessMessage(messageObj);
          this.messageStream.push(message);
        } else {
          // Send a notification (noise, highlight channel with message, update channel w/ number
          //                      indicating the # of unread messages)
        }
      }
    };

    connection.onopen = function() {
      console.log("Successfully connected to the echo websocket server...");
    };
    connection.onclose = function() {
      console.log("Disconnected from the echo websocket server...");
    };
    connection.onerror = function() {
      console.log("Error originating from the echo websocket server...");
    };
  },
  methods: {
    async GetMessages() {
      var url =
        "https://slack.api.tristanmacelli.com/v1/channels/" + this.channelID;
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
        "https://slack.api.tristanmacelli.com/v1/channels/" + this.channelID;
      let sessionToken = localStorage.getItem("auth");

      // Get user first name from store & add it to this object
      let date = new Date();
      let formattedDate = this.formatDate(date);
      let requestBody = {
        channelID: this.channelID,
        creator: this.user,
        body: this.NewBody,
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
      this.NewBody = "";
      this.updateScroll();
    },
    getChannelID() {
      return this.channelID;
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
