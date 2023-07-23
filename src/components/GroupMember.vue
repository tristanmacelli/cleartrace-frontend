<template>
  <div
    class="flex no-wrap items-center rounded-md border border-solid border-gray-300 pl-3 pr-1.5 py-1"
    :class="disabled ? 'pr-3' : ''"
  >
    <p class="flex-grow text-sm">
      {{ name }}
    </p>
    <div>
      <!-- Member removal is disabled when the current user is not the creator of the group -->
      <p
        v-if="!disabled"
        @click="$emit('remove', index)"
        class="cursor-pointer text-sm ml-1 px-1.5 pt-0.5 hover:bg-gray-200 rounded-3xl"
      >
        X
      </p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "groupMember",
});
</script>

<script lang="ts" setup>
defineProps<{
  name: string;
  index: number;
  disabled: boolean;
}>();
</script>
