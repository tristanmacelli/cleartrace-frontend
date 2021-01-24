<template>
  <p class="message">
    <strong>{{ name }}</strong>
    {{ body + " " + date }}
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
    name: {
      type: String,
      required: true
    },
    date: {
      type: String,
      required: true
    }
  }
};
</script>
