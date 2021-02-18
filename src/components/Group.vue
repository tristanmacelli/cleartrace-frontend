<template>
  <div
    class="px-4 py-3 truncate hover:bg-gray-300 rounded-md cursor-pointer"
    :class="{ 'sm:bg-gray-100': isStoredGroup }"
    v-on:click="SetGroup"
  >
    <p>{{ name }}</p>
    <p class="hidden truncate">{{ this.latestMessage }}</p>
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
  data() {
    return {
      latestMessage: ""
    };
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
