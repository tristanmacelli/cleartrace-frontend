<template>
  <div class="modal">
    <div class="container">
      <div class="modal__title">{{ UpdateMessage }}</div>
      <p>{{ GroupName }} group has been {{ Action }}</p>
      <a v-if="groupDeleted" href="#" class="btn go-to">
        Go to
        {{ GroupName }}
      </a>
      <button class="mt-3 border-b border-teal font-semibold">Close</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "groupUpdate",
  props: {
    Action: {
      type: String,
      required: true
    },
    GroupName: {
      type: String,
      required: true
    },
    GroupDeleted: {
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
      groupDeleted: this.GroupDeleted
    };
  }
};
</script>

<style lang="css" scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.7);
}
</style>
