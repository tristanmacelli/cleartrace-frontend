<template>
  <div @keyup.down="this.NextItem" @keyup.up="this.PrevItem" class="">
    <ul
      class="absolute z-50 w-5/6 shadow-xl text-gray-700 pt-1 cursor-pointer"
      :class="this.positionRight ? 'right-4' : ''"
    >
      <list-item
        v-for="(item, index) in this.items"
        :key="item.id"
        :index="index"
        :text="item.text"
        :class="item.index === this.currentItem ? 'bg-gray-200' : 'bg-white'"
        @active-list-item="this.HandleListItem"
      >
      </list-item>
    </ul>
  </div>
</template>

<script>
import ListItem from "@/components/ListItem.vue";

export default {
  name: "list",
  components: {
    ListItem
  },
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
    HandleListItem(index) {
      this.$emit("activeListItem", index);
    }
  }
};
</script>
