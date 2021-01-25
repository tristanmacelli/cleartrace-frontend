<template>
  <div class="channel">
    <p v-on:click="SetCurrentChannel"># {{ name }}</p>
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
  data() {
    return {
      isCurrentChannel: this.isStoredCurrentChannel()
    };
  },
  methods: {
    SetCurrentChannel() {
      if (!this.isCurrentChannel) {
        this.$store.commit("setChannel", {
          channelID: this.id,
          channelName: this.name
        });
      }
    }
  },
  computed: {
    // If this is true we want to apply the same css rules as applied to the .channel:hover class
    isStoredCurrentChannel() {
      return this.id == this.$store.getters.getChannelID;
    }
  },
  watch: {
    isCurrentChannel: async function() {
      // Apply the css class
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
  background-color: lightsteelblue;
}
</style>
