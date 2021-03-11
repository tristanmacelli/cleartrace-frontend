<template>
  <div @keyup.down="this.NextItem" @keyup.up="this.PrevItem" class="">
    <ul
      class="absolute z-50 w-60 shadow-xl text-gray-700 pt-1 cursor-pointer"
      :class="this.positionRight ? 'right-4' : ''"
    >
      <li
        v-for="(item, index) in this.items"
        :key="item.id"
        :class="index === this.currentItem ? 'bg-blue-600' : 'bg-white'"
        class="w-full py-2 px-4 text-left bg-white hover:bg-gray-300 cursor-pointer"
        @click="HandleListItem(item)"
      >
        {{ item.text }}
      </li>
    </ul>
  </div>
</template>

<script>
import { ref } from "vue";
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
  setup(_, context) {
    const currentItem = ref(-1);
    const NextItem = () => {
      console.log("Calling NextItem");
      if (currentItem.value < 19) {
        currentItem.value++;
      }
    };
    const PrevItem = () => {
      console.log("Calling PrevItem");
      if (currentItem.value > -1) {
        currentItem.value--;
      }
    };
    const HandleListItem = item => {
      context.emit("activeListItem", item);
    };
    return {
      currentItem,
      HandleListItem,
      NextItem,
      PrevItem
    };
  }
};
</script>
