<template>
  <div
    class="flex flex-nowrap px-4 py-3 truncate rounded-md cursor-pointer"
    :class="{ 'sm:bg-gray-100': isStoredGroup }"
    v-on:click="SetGroup"
  >
    <div class="flex-grow self-center">
      <p class="font-bold">{{ name }}</p>
      <p class="font-extralight truncate">Latest Message: ...</p>
    </div>
    <div
      @click="DisplayModalUpdate"
      class="flex px-3 my-1 font-bold shadow-sm bg-white hover:bg-gray-200 border-gray-300 border rounded-3xl"
    >
      <p class="self-center">...</p>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";

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
  computed: mapState({
    // If this is true we want to apply the same css rules as applied to the .group:hover class
    isStoredGroup: state => this.id === state.group.id
  }),
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
      let modalState = {
        type: "update",
        group: {
          creator: this.creator,
          description: this.description,
          id: this.id,
          members: this.members,
          name: this.name
        }
      };
      this.$emit("displayModal", modalState);
    }
  }
};
</script>
