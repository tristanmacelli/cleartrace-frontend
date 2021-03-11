<template>
  <!-- https://codepen.io/huphtur/pen/ordMeN -->
  <!-- https://tailwindui.com/components/application-ui/elements/dropdowns -->
  <div @mouseleave="this.HideDropdown" class="w-8">
    <button
      @click="this.ToggleDropdown"
      class="font-bold text-lg p-2 rounded-3xl focus:outline-none bg-gray-200 hover:bg-gray-300"
    >
      <svg class="fill-current h-4 w-4" viewBox="0 0 20 20">
        <path
          d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
        />
      </svg>
    </button>
    <slot v-if="this.showDropdown"></slot>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  name: "dropdown",
  setup() {
    const showDropdown = ref(false);
    const ToggleDropdown = () => {
      showDropdown.value = !showDropdown.value;
    };
    const HideDropdown = () => {
      showDropdown.value = false;
    };
    return {
      showDropdown,
      HideDropdown,
      ToggleDropdown
    };
  }
};
</script>
