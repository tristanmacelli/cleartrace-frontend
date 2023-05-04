<template>
  <div
    class="flex no-wrap items-center rounded-md border border-solid border-gray-300 px-3 py-1"
  >
    <p class="flex-grow text-sm">
      {{ this.name }}
    </p>
    <div>
      <p
        @click="$emit('remove', this.index)"
        class="cursor-pointer text-sm px-1.5 pt-0.5 hover:bg-gray-200 rounded-3xl"
      >
        X
      </p>
    </div>
  </div>
</template>

<script>
export default {
  name: "groupMember",
  props: {
    name: {
      type: String,
      required: true,
    },
    index: {
      type: Number,
      required: true,
    },
  },
};
</script>
