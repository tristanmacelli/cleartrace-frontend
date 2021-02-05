<template>
  <!-- https://codepen.io/huphtur/pen/ordMeN -->
  <!-- https://tailwindui.com/components/application-ui/elements/dropdowns -->
  <div @mouseleave="this.hideDropdown" class="w-8">
    <button
      @click="this.toggleDropdown"
      class="font-bold text-lg p-2 rounded-3xl focus:outline-none bg-gray-200 hover:bg-gray-300"
    >
      <svg class="fill-current h-4 w-4" viewBox="0 0 20 20">
        <path
          d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"
        />
      </svg>
    </button>
    <div class="">
      <ul
        v-if="this.showDropdown"
        class="absolute z-50 w-max right-4 shadow-xl text-gray-700 pt-1 cursor-pointer"
      >
        <slot></slot>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "dropdown",
  data() {
    return {
      showDropdown: false
    };
  },
  methods: {
    toggleDropdown() {
      this.showDropdown = !this.showDropdown;
    },
    hideDropdown() {
      this.showDropdown = false;
    }
  }
};
</script>
