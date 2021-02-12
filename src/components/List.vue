<template>
  <div class="">
    <ul
      class="absolute z-50 w-max shadow-xl text-gray-700 pt-1 cursor-pointer"
      :class="this.bool ? 'right-4' : 'right-0'"
    >
      <slot></slot>
    </ul>
  </div>
</template>

<script>
export default {
  name: "list",
  props: {
    bool: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      currentItem: -1
    };
  },
  methods: {
    NextItem(e) {
      if (e.keyCode == 38 && this.currentItem > 0) {
        this.currentItem--;
      } else if (e.keyCode == 40 && this.currentItem < 20) {
        this.currentItem++;
      }
    }
  },
  mounted() {
    document.addEventListener("keyup", this.NextItem);
  }
};
</script>
