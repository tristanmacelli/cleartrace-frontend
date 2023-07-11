<!-- https://vuejs.org/guide/built-ins/teleport.html#basic-usage -->

<!-- New html dialog tag natively supports modal functionality -->
<!-- https://www.youtube.com/watch?v=ywtkJkxJsdg -->

<template>
  <div
    class="absolute z-50 sm:block w-80 sm:w-max h-88 rounded-md shadow-xl bg-white"
  >
    <div class="flex no-wrap p-5 border-b border-gray-300">
      <div class="flex-grow">
        <p class="text-2xl font-bold">{{ Title }}</p>
        <p>{{ Description }}</p>
      </div>
      <button
        @click.prevent="$emit('hideModal')"
        class="p-2 h-8 cursor-pointer hover:bg-gray-200 rounded-3xl focus:outline-none"
      >
        <img src="../assets/black-x.svg" width="16" alt="a black x icon" />
      </button>
    </div>
    <div class="p-5 grid justify-center">
      <slot></slot>
    </div>
  </div>
  <div
    @click.prevent="$emit('hideModal')"
    class="absolute w-screen h-screen z-40 opacity-80 bg-gray-300"
  ></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "modalComponent",
});
</script>

<script lang="ts" setup>
defineProps<{
  Title: string; // Note: this prop was previously optional.
  Description: string;
}>();

const emit = defineEmits(["hideModal"]);

window.addEventListener("keydown", (e: KeyboardEvent) => {
  if (e.key === "Escape") emit("hideModal");
});
</script>
