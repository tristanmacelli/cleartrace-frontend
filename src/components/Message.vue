<template>
  <div class="flex sm:w-min" :class="{ 'justify-self-end': isAuthor }">
    <p
      class="m-1 px-3 py-2 text-sm rounded-3xl bg-gray-300 max-w-xs sm:w-max select-none"
      :class="{ author: isAuthor }"
    >
      <strong v-if="!isAuthor">{{
        creator.firstName + " " + creator.lastName
      }}</strong>
      {{ body + " " + createdAtTime }}
    </p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "messageComponent",
});
</script>

<script lang="ts" setup>
import { State } from "@/store";
import { computed, defineProps } from "vue";
import { useStore } from "vuex";
import { LocalUser } from "../types";

const props = defineProps<{
  id: string;
  body: string;
  creator: LocalUser;
  createdAt: Date;
  createdAtTime: string;
}>();

defineEmits(["remove"]);

const { state } = useStore<State>();
const isAuthor = computed(
  () => props.creator.firstName == state.user?.firstName
);
</script>

<style>
.author {
  color: white;
  justify-self: end;
  background-color: dodgerblue;
}
</style>
