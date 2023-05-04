<template>
  <div class="flex sm:w-min" :class="{ 'justify-self-end': isAuthor }">
    <p
      class="m-1 px-3 py-2 text-sm rounded-3xl bg-gray-300 max-w-xs sm:w-max select-none"
      :class="{ author: isAuthor }"
    >
      <strong v-if="!this.isAuthor">{{
        creator.FirstName + " " + creator.LastName
      }}</strong>
      {{ body + " " + createdAt }}
    </p>
  </div>
</template>

<script>
import { computed } from "vue";
import { useStore } from "vuex";

export default {
  name: "messageComponent",
  props: {
    id: {
      type: String,
      required: true,
    },
    body: {
      type: String,
      required: true,
    },
    creator: {
      type: Object,
      required: true,
    },
    createdAt: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const store = useStore();
    const isAuthor = computed(
      () => props.creator.FirstName == store.state.user.FirstName
    );
    return { isAuthor };
  },
  emits: ["remove"],
};
</script>

<style>
.author {
  color: white;
  justify-self: end;
  background-color: dodgerblue;
}
</style>
