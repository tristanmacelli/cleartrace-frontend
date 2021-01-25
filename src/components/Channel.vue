<template>
  <div
    class="channel"
    :class="{ current: isStoredChannel }"
    v-on:click="SetChannel"
  >
    <p># {{ name }}</p>
  </div>
</template>

<script>
export default {
  name: "channel",
  props: {
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  methods: {
    SetChannel() {
      if (!this.isStoredChannel) {
        this.$store.commit("setChannel", {
          channelID: this.id,
          channelName: this.name
        });
      }
    }
  },
  computed: {
    // If this is true we want to apply the same css rules as applied to the .channel:hover class
    isStoredChannel() {
      return this.id == this.$store.getters.getChannelID;
    }
  }
};
</script>

<style>
.channel {
  padding: 0.0007em 1em;
  cursor: pointer;
}

.channel:hover {
  background-color: steelblue;
}

.current {
  background-color: lightsteelblue;
}
</style>
