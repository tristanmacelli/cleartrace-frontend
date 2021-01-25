<template>
  <p class="message">
    <strong>{{ creator.FirstName + " " + creator.LastName }}</strong>
    {{ body + " " + createdAt }}
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
  }
};
</script>
