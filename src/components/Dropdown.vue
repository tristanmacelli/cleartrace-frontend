<template>
  <!-- https://codepen.io/huphtur/pen/ordMeN -->
  <!-- https://tailwindui.com/components/application-ui/elements/dropdowns -->
  <div @mouseleave="HideDropdown" class="w-8">
    <button
      @click="ToggleDropdown"
      class="font-bold rounded-3xl focus:outline-none bg-gray-200 hover:bg-gray-300"
    >
      <p class="h-8 pt-1.5 px-1 bg-gray-200 rounded-3xl">
        {{ userInitials }}
      </p>
    </button>
    <slot v-if="showDropdown"></slot>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "dropDown",
});
</script>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";
import usePiniaStore from "@/store/pinia";
import { storeToRefs } from "pinia";

const pinia = usePiniaStore();
const { userInitials } = storeToRefs(pinia);
const showDropdown = ref(false);

const ToggleDropdown = () => {
  showDropdown.value = !showDropdown.value;
};

const HideDropdown = () => {
  showDropdown.value = false;
};

const hideDropdownOnEscape = (e: KeyboardEvent) => {
  if (e.key === "Escape") HideDropdown();
};
onMounted(() => {
  window.addEventListener("keydown", hideDropdownOnEscape);
});
onUnmounted(() => {
  window.removeEventListener("keydown", hideDropdownOnEscape);
});
</script>
