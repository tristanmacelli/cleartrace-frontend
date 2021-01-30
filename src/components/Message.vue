<template>
  <div class="flex sm:w-min" :class="{ 'justify-self-end': isAuthor }">
    <p
      class="m-1 px-3 py-2 text-sm rounded-3xl bg-gray-300 max-w-xs sm:w-max"
      :class="{ author: isAuthor }"
    >
      <strong v-if="!this.isAuthor">{{
        creator.FirstName + " " + creator.LastName
      }}</strong>
      {{ body + " " + createdAt }}
      <!-- <button @click="$emit('remove')">(X)</button> -->
    </p>
  </div>
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
