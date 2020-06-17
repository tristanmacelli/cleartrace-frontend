<template>
  <div class="channel">
    <p>{{ name }}</p>
  </div>
</template>

<script>
export default {
  name: "channel",
  props: {
    name: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    }
  }
};
</script>

<style>
.channel {
  cursor: pointer;
}
</style>
