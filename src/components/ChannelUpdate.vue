<template>
  <div class="modal">
    <div class="container">
      <div class="modal__title">{{ UpdateMessage }}</div>
      <p>{{ ChannelName }} channel has been {{ Action }}</p>
      <a v-if="channelDeleted" href="#" class="btn go-to">
        Go to
        {{ ChannelName }}
      </a>
      <button class="mt-3 border-b border-teal font-semibold">Close</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "Modal",
  props: {
    Action: {
      type: String,
      required: true
    },
    ChannelName: {
      type: String,
      required: true
    },
    ChannelDeleted: {
      type: Boolean,
      required: true
    },
    UpdateMessage: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      channelDeleted: this.ChannelDeleted
    };
  }
};
</script>

<style lang="css" scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.7);
}
</style>
