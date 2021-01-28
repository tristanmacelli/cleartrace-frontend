<template>
  <p class="m-1 p-1 rounded-lg">
    <strong>{{ creator.FirstName + " " + creator.LastName }}</strong>
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
  emits: ["remove"]
};
</script>
