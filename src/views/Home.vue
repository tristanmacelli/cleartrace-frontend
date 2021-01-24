<template>
  <div id="home" class="main">
    <MessageStream
      v-bind:ChannelID="currentChannelID"
      v-bind:ChannelName="currentChannelName"
      v-bind:Socket="socket"
      v-bind:User="user"
    ></MessageStream>
    <Channels
      v-bind:ChannelID="currentChannelID"
      v-bind:Socket="socket"
    ></Channels>
  </div>
</template>

<script>
// @ is an alias to /src
import MessageStream from "@/components/MessageStream.vue";
import Channels from "@/components/Channels.vue";
// import EventBus from "../event-bus.js";

export default {
  name: "Home",
  props: {
    Socket: {
      type: Object,
      required: true
    }
  },
  components: {
    MessageStream,
    Channels
  },
  data() {
    return {
      connection: null,
      currentChannelID: "5fec04e96d55740010123439",
      currentChannelName: "General",
      socket: this.Socket,
      user: null
    };
  },
  created: function() {
    let sessionToken = localStorage.getItem("auth");
    if (!sessionToken) {
      this.$router.push({ path: "/" });
    }
    // Update data with the values in the store for currentChannelName/ID
    // if these values dont exist then execute the following:
    // this.GetSpecificChannel(this.currentChannelName);
    // this.handleConnectionCreation();
    this.request_user(sessionToken);
    // TODO: Figure out how to have multiple onmessage OR another structure of handling info
    // this.socket.onmessage = event => {
    //   // The data we created is in the event.data field
    //   // The current datatype of event is message
    //   let receivedObj = JSON.parse(event.data);
    //   let messageObj = receivedObj.message;
    //   let isCurrentChannel = messageObj.channelID == this.ChannelID;

    //   if (receivedObj.type == "channel-new") {
    //     // Show modal with an option to navigate to the new channel
    //     // GetChannels() will be called from the Channels component
    //   }
    //   if (receivedObj.type == "channel-update") {
    //     // Show modal indicating there has been changes to a channel name
    //     // GetChannels() will be called from the Channels component
    //   }
    //   if (receivedObj.type == "channel-delete" && isCurrentChannel) {
    //     // Show modal indicating the current channel was deleted & that the user will be
    //     // navigated to the General channel automatically after closing the modal
    //     // 1. Make current channel id & name == General
    //     // 2. Call GetChannels in Channels component
    //   } else if (receivedObj.type == "channel-delete") {
    //     // Show modal indicating that a channel was deleted & after closing the modal
    //     // GetChannels() will be called from the Channels component
    //   }
    // };
  },
  methods: {
    // async GetSpecificChannel(channel_name) {
    //   var url =
    //     "https://slack.api.tristanmacelli.com/v1/channels?startsWith=" +
    //     channel_name;
    //   let sessionToken = localStorage.getItem("auth");

    //   // send a get request with the above data
    //   let resp = await fetch(url, {
    //     method: "GET",
    //     headers: {
    //       Authorization: sessionToken
    //     }
    //   });
    //   if (!resp.ok) {
    //     alert("Error: ", resp.status);
    //   }
    //   let channels = await resp.json();
    //   this.currentChannelID = channels[0].id;
    //   // Store this channel name & id into the store as the current channel information
    // },
    async request_user(token) {
      let url = "https://slack.api.tristanmacelli.com/v1/users/";
      let resp = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: token
        }
      });
      if (!resp.ok) {
        alert("Error: ", resp.status);
      }
      let response = await resp.json();
      this.user = response;
      this.$store.commit("setUser", { user: this.user });
      // display_user_fn();
    }

    // display_user_first_name() {
    //   EventBus.$emit("display-user-firstname", this.user.FirstName);
    // }
  }
};
</script>
