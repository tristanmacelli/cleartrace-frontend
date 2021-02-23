<template>
  <div
    class="absolute z-50 sm:block w-80 sm:w-max h-88 rounded-md shadow-xl bg-white"
  >
    <div class="flex no-wrap p-5 border-b border-gray-300">
      <div class="flex-grow">
        <p class="text-2xl font-bold">{{ Title ? Title : modalTitle }}</p>
        <p>{{ Description }}</p>
      </div>
      <button
        @click.prevent="$emit('hideModal')"
        class="p-2 h-8 cursor-pointer hover:bg-gray-200 rounded-3xl focus:outline-none"
      >
        <svg class="w-4" viewBox="0 0 96 96" enable-background="new 0 0 96 96">
          <polygon
            fill="black"
            points="96,14 82,0 48,34 14,0 0,14 34,48 0,82 14,96 48,62 82,96 96,82 62,48 "
          />
        </svg>
      </button>
    </div>
    <div class="sm:w-80 p-5">
      <slot></slot>
    </div>
  </div>
  <div class="absolute w-screen h-screen z-40 opacity-80 bg-gray-300"></div>
</template>

<script>
export default {
  name: "modal",
  props: {
    Title: {
      type: String,
      required: false
    },
    Description: {
      type: String,
      required: true
    }
  },
  emits: ["hideModal"]
};
</script>
