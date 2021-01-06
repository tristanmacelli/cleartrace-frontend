<template>
  <div class="modal">
    <div class="container">
      <div class="modal__title">Create a New Channel</div>
      <input
        id="messageBody"
        v-model="newBody"
        type="text"
        placeholder="Type a channel name..."
      />
      <button class="mt-3 border-b border-teal font-semibold">Create</button>
    </div>
  </div>
</template>

<script>
export default {
  name: "CreateChannel"
};
</script>

<style lang="css" scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.7);
}
</style>
