<template>
  <div class="channel">
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
