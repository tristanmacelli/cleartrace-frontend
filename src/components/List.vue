<template>
  <div>
    <ul
      class="absolute z-50 w-60 shadow-xl text-gray-700 pt-1 cursor-pointer"
      :class="positionRight ? 'right-4' : ''"
    >
      <li
        v-for="(item, index) in items"
        :key="item.id"
        ref="itemRefs"
        class="w-full py-2 px-4 text-left bg-white hover:bg-gray-300 focus:bg-gray-300 cursor-pointer"
        :class="index === currentItem ? 'text-dodgerblue' : ''"
        @hover="currentItem = index"
        @click="HandleListItem(item)"
      >
        {{ item.text }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "listComponent",
});
</script>

<script lang="ts" setup>
import { ref, onMounted, onUnmounted } from "vue";
import { storeToRefs } from "pinia";
import usePiniaStore from "@/store/pinia";

const props = defineProps<{
  items: Array<any>;
  positionRight: Boolean;
}>();

const emit = defineEmits(["activeListItem"]);
const pinia = usePiniaStore();
const { debug } = storeToRefs(pinia);
const currentItem = ref(0);
const itemRefs = ref<HTMLInputElement[]>([]);

const NextItem = () => {
  if (debug.value) console.log("Calling NextItem");
  if (currentItem.value < props.items.length - 1) {
    currentItem.value++;
  }
};
const PrevItem = () => {
  if (debug.value) console.log("Calling PrevItem");
  if (currentItem.value > 0) {
    currentItem.value--;
  }
};

const navigateListItems = (e: KeyboardEvent) => {
  switch (e.key) {
    case "ArrowUp": {
      PrevItem();
      break;
    }
    case "ArrowDown": {
      NextItem();
      break;
    }
    default: {
      break;
    }
  }
  // itemRefs.value[currentItem.value].focus();
};
const enterAsClickItem = (e: KeyboardEvent) => {
  if (e.key === "Enter") itemRefs.value[currentItem.value].click();
};

onMounted(() => {
  window.addEventListener("keydown", navigateListItems);
  window.addEventListener("keydown", enterAsClickItem);
});
onUnmounted(() => {
  window.removeEventListener("keydown", navigateListItems);
  window.removeEventListener("keydown", enterAsClickItem);
});
const HandleListItem = (item: any) => {
  emit("activeListItem", item);
};
</script>
