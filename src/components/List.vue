<template>
  <div @keyup.down="NextItem" @keyup.up="PrevItem" class="">
    <ul
      class="absolute z-50 w-60 shadow-xl text-gray-700 pt-1 cursor-pointer"
      :class="positionRight ? 'right-4' : ''"
    >
      <li
        v-for="(item, index) in items"
        :key="item.id"
        :class="index === currentItem ? 'bg-blue-600' : 'bg-white'"
        class="w-full py-2 px-4 text-left bg-white hover:bg-gray-300 cursor-pointer"
        @click="HandleListItem(item)"
      >
        {{ item.text }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
// import { State } from "@/store";

export default defineComponent({
  name: "listComponent",
});
</script>

<script lang="ts" setup>
import { defineProps, ref } from "vue";
// import { useStore } from "vuex";
import usePiniaStore from "@/store/pinia";

defineProps<{
  items: Array<any>;
  positionRight: Boolean;
}>();
const emit = defineEmits(["activeListItem"]);

// const { state } = useStore<State>();
const pinia = usePiniaStore();
const currentItem = ref(1);

const NextItem = () => {
  // eslint-disable-next-line
  if (pinia.debug) console.log("Calling NextItem");
  if (currentItem.value < 19) {
    currentItem.value++;
  }
};
const PrevItem = () => {
  // eslint-disable-next-line
  if (pinia.debug) console.log("Calling PrevItem");
  if (currentItem.value > -1) {
    currentItem.value--;
  }
};
const HandleListItem = (item: any) => {
  emit("activeListItem", item);
};
</script>
