<template>
  <div class="modal">
    <div class="container">
      <div class="modal__title">Create a New Group</div>
      <input
        id="messageBody"
        v-model="newBody"
        type="text"
        placeholder="Type a group name..."
      />
      <button class="mt-3 border-b border-teal font-semibold">Create</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "groupCreate"
};
</script>

<style lang="css" scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.7);
}
</style>
