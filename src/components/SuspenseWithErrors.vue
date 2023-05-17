<!-- https://www.codemag.com/Article/2011091/The-Complete-Guide-to-Suspense-in-Vue3 -->

<template>
  <slot v-if="error" name="error" :error="error"></slot>
  <Suspense v-else>
    <template #default>
      <slot name="default"></slot>
    </template>
    <template #fallback>
      <slot name="fallback"></slot>
    </template>
  </Suspense>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "SuspenseWithErrors",
});
</script>

<script lang="ts" setup>
import { onErrorCaptured, ref } from "vue";

const error = ref<Error>();

onErrorCaptured((err: Error) => {
  error.value = err;
});
</script>
