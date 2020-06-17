<template>
  <div id="channels">
    <div
      is="channel"
      v-for="channel in channels"
      v-bind:key="channel.name"
      v-bind:name="channel.name"
      v-bind:id="channel.id"
    ></div>
  </div>
</template>

<script>
import Channel from "./Channel.vue";

export default {
  name: "channels",
  data() {
    return {
      channels: []
    };
  },
  components: {
    Channel
  },
  created: async function() {
    console.log("Getting Channels:");
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
    console.log(channels);
    channels
      .slice()
      .reverse()
      .forEach(channel => {
        console.log(channel);
        this.channels.push(channel);
      });
  }
};
</script>

<style>
#channels {
  width: 25vw;
  float: left;
  height: 70vh;
  padding: 2em;
}
</style>
