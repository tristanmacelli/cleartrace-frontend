<template>
  <div id="channels">
    <h3>
      Your Channels:
    </h3>
    <channel v-for="chan in channels" :channel="chan" :key="chan.id"></channel>
  </div>
</template>

<script>
import Channel from "./Channel.vue";

export default {
  name: "channels",
  props: {
    ChannelID: {
      type: String,
      required: true
    },
    Socket: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      channels: [],
      socket: this.Socket
    };
  },
  components: {
    Channel
  },
  created: async function() {
    await this.GetChannels();
    // this.socket.onmessage = event => {
    //   // The data we created is in the event.data field
    //   // The current datatype of event is message
    //   let receivedObj = JSON.parse(event.data);
    //   let messageObj = receivedObj.message;

    //   if (receivedObj.type == "message-new") {
    //     if (messageObj.channelID != this.ChannelID) {
    //       // Send a notification (noise, highlight channel with message, update channel w/ number
    //       //                      indicating the # of unread messages)
    //     }
    //   }
    // };
  },
  methods: {
    async GetChannels() {
      this.channels = [];
      var url = "https://slack.api.tristanmacelli.com/v1/channels";
      let sessionToken = localStorage.getItem("auth");

      // send a get request with the above data
      let resp = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: sessionToken
        }
      });
      if (!resp.ok) {
        alert(resp.status);
        throw new Error(resp.status.toString());
      }
      let channels = await resp.json();
      channels
        .slice()
        .reverse()
        .forEach(channel => {
          this.channels.push(channel);
        });
    }
  }
};
</script>

<style>
#channels {
  height: 88vh;
  width: 29vw;
  padding: 0 2em;
  float: left;
  overflow: scroll;
}
</style>
