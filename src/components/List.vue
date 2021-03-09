<template>
  <div @keyup.down="this.NextItem" @keyup.up="this.PrevItem" class="">
    <ul
      class="absolute z-50 w-60 shadow-xl text-gray-700 pt-1 cursor-pointer"
      :class="this.positionRight ? 'right-4' : ''"
    >
      <li
        v-for="(item, index) in this.items"
        :key="item.id"
        :class="index === this.currentItem ? 'bg-gray-200' : 'bg-white'"
        class="w-full py-2 px-4 text-left bg-white hover:bg-gray-300 cursor-pointer"
        @click="HandleListItem(item)"
      >
        {{ item.text }}
      </li>
    </ul>
  </div>
</template>

<script>
export default {
  name: "list",
  props: {
    items: {
      type: Array,
      required: true
    },
    positionRight: {
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
    NextItem() {
      console.log("Calling NextItem");
      if (this.currentItem < 19) {
        this.currentItem++;
      }
    },
    PrevItem() {
      console.log("Calling PrevItem");
      if (this.currentItem > -1) {
        this.currentItem--;
      }
    },
    HandleListItem(item) {
      this.$emit("activeListItem", item);
    }
  }
};
</script>
