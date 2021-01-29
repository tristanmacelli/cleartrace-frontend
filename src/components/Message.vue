<template>
  <p
    class="m-1 px-2 py-1 rounded-2xl bg-gray-300 w-max"
    :class="{ author: isAuthor }"
  >
    <strong v-if="!this.isAuthor">{{
      creator.FirstName + " " + creator.LastName
    }}</strong>
    {{ body + " " + createdAt }}
    <!-- <button @click="$emit('remove')">(X)</button> -->
  </p>
</template>

<script>
export default {
  name: "message",
  props: {
    id: {
      type: String,
      required: true
    },
    body: {
      type: String,
      required: true
    },
    creator: {
      type: Object,
      required: true
    },
    createdAt: {
      type: String,
      required: true
    }
  },
  emits: ["remove"],
  computed: {
    isAuthor() {
      return this.creator.FirstName == this.$store.getters.getUserFirstname;
    }
  }
};
</script>

<style>
.author {
  color: white;
  justify-self: end;
  background-color: dodgerblue;
}
</style>
