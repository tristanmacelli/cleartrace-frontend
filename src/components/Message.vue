<template>
  <div class="flex sm:w-min" :class="{ 'justify-self-end': isAuthor }">
    <p
      class="m-1 px-3 py-2 text-sm rounded-3xl max-w-xs sm:w-max select-none"
      :class="isAuthorMessageProperties"
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
import { computed, reactive } from "vue";
import usePiniaStore from "@/store/pinia";
import { LocalUser } from "../types";
import { storeToRefs } from "pinia";

const props = defineProps<{
  id: string;
  body: string;
  creator: LocalUser;
  createdAt: Date;
  createdAtTime: string;
}>();

defineEmits(["remove"]);

const pinia = usePiniaStore();
const { user } = storeToRefs(pinia);
const isAuthor = computed(
  () => props.creator.firstName == user.value?.firstName
);

const isAuthorMessageProperties = reactive({
  "text-white": isAuthor.value,
  "justify-self-end": isAuthor.value,
  "bg-dodgerblue": isAuthor.value,
  "bg-gray-300": !isAuthor.value,
});
</script>
