<template>
  <div id="home" class="main">
    <MessageStream></MessageStream>
    <Channels></Channels>
  </div>
</template>

<script>
// @ is an alias to /src
import MessageStream from "@/components/MessageStream.vue";
import Channels from "@/components/Channels.vue";

export default {
  name: "Home",
  components: {
    MessageStream,
    Channels
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
  }
};
</script>
