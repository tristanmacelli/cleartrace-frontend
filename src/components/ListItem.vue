<template>
  <li
    @click="$emit('activeListItem', this.index)"
    class="w-full py-2 px-4 text-left bg-white hover:bg-gray-300 cursor-pointer"
  >
    {{ text }}
  </li>
</template>

<script>
export default {
  name: "listItem",
  props: {
    index: {
      type: Number,
      required: true
    },
    text: {
      type: String,
      required: true
    }
  }
};
</script>
