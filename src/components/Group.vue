<template>
  <div class="group" :class="{ current: isStoredGroup }" v-on:click="SetGroup">
    <p># {{ name }}</p>
  </div>
</template>

<script>
export default {
  name: "group",
  props: {
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    }
  },
  methods: {
    SetGroup() {
      if (!this.isStoredGroup) {
        this.$store.commit("setGroup", {
          groupID: this.id,
          groupName: this.name
        });
      }
    }
  },
  computed: {
    // If this is true we want to apply the same css rules as applied to the .group:hover class
    isStoredGroup() {
      return this.id == this.$store.getters.getGroupID;
    }
  }
};
</script>

<style>
.group {
  padding: 0.0007em 1em;
  cursor: pointer;
  border-radius: 10px;
}

.group:hover {
  background-color: steelblue;
}

.current {
  background-color: lightsteelblue;
}
</style>
