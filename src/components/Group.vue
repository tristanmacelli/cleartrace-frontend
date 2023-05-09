<template>
  <div
    class="flex flex-nowrap px-4 py-3 truncate rounded-md cursor-pointer"
    :class="{ 'sm:bg-gray-100': isStoredGroup }"
    v-on:click="SetGroup"
  >
    <div class="flex-grow self-center">
      <p class="font-bold">{{ name }}</p>
      <p class="font-extralight truncate">Latest Message: ...</p>
    </div>
    <div
      @click="DisplayModalUpdate"
      class="flex px-3 my-1 font-bold shadow-sm bg-white hover:bg-gray-200 border-gray-300 border rounded-3xl"
    >
      <p class="self-center">...</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "groupComponent",
});
</script>

<script lang="ts" setup>
import { State } from "@/store";
import { computed, defineProps } from "vue";
import { useStore } from "vuex";
import { LocalUser } from "..";

const props = defineProps<{
  id: string;
  name: string;
  description: string;
  members: Array<any>;
  creator: LocalUser;
  index: Number;
}>();

const emit = defineEmits(["displayModal"]);

const store = useStore<State>();
// If this is true we want to apply the same css rules as applied to the .group:hover class
const isStoredGroup = computed(() => props.id == store.state.activeGroup.id);

const SetGroup = () => {
  if (!isStoredGroup.value) {
    let groupObj = {
      id: props.id,
      name: props.name,
    };
    store.commit("setGroup", {
      group: groupObj,
    });
  }
};

const DisplayModalUpdate = () => {
  let modalState = {
    group: {
      creator: props.creator,
      description: props.description,
      id: props.id,
      index: props.index,
      members: props.members,
      name: props.name,
    },
    type: "update",
  };

  store.commit("setgroupModalData", {
    groupModalData: modalState,
  });
  emit("displayModal");
};
</script>
