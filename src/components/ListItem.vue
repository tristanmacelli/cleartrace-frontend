<template>
  <li
    class="w-full py-2 px-4 text-left bg-white hover:bg-gray-200 cursor-pointer"
  >
    <slot></slot>
  </li>
</template>

<script>
export default {
  name: "listItem"
};
</script>
