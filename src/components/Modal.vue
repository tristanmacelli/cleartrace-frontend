<template>
  <div class="modal">
    <div>
      <p class="text-2xl font-bold">{{ Title }}</p>
      <p>{{ Description }}</p>
      <img />
    </div>
    <div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  name: "modal",
  props: {
    Title: {
      type: String,
      required: true
    },
    Description: {
      type: String,
      required: true
    }
  }
};
</script>
