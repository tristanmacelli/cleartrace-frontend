<template>
  <div
    class="grid grid-rows-2 grid-cols-2 px-4 py-3 truncate hover:bg-gray-300 rounded-md cursor-pointer"
    :class="{ 'sm:bg-gray-100': isStoredGroup }"
    v-on:click="SetGroup"
  >
    <p>{{ name }}</p>
    <p class="hidden truncate">{{ this.latestMessage }}</p>
    <div class="row-span-2"><p @click="DisplayModalUpdate">(i)</p></div>
  </div>
</template>

<script>
export default {
  name: "group",
  props: {
    creator: {
      type: Object,
      required: true
    },
    description: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    },
    members: {
      type: Array,
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
  emits: ["displayModal"],
  methods: {
    SetGroup() {
      if (!this.isStoredGroup) {
        let groupObj = {
          id: this.id,
          name: this.name
        };
        this.$store.commit("setGroup", {
          group: groupObj
        });
      }
    },
    DisplayModalUpdate() {
      let modalState;
      modalState.type = "update";
      modalState.group = {
        creator: this.creator,
        description: this.description,
        id: this.id,
        members: this.members,
        name: this.name
      };
      this.$emit("displayModal", modalState);
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
