<template>
  <div
    id="home"
    class="h-screen w-screen bg-cover flex flex-nowrap items-center justify-center"
  >
    <div class="w-screen h-screen">
      <MessageList></MessageList>
      <GroupList @display-create="this.DisplayCreate"></GroupList>
    </div>
    <GroupModal
      v-if="this.displayCreate"
      @hide-modal="HideModal"
      type="Create"
    ></GroupModal>
  </div>
</template>

<script>
// @ is an alias to /src
import GroupList from "@/components/GroupList.vue";
import GroupModal from "@/components/GroupModal.vue";
import MessageList from "@/components/MessageList.vue";

export default {
  name: "Home",
  components: {
    GroupList,
    GroupModal,
    MessageList
  },
  data() {
    return {
      displayCreate: false
    };
  },
  provide() {
    return {
      modalTitle: "New Group"
    };
  },
  methods: {
    DisplayCreate() {
      this.displayCreate = true;
    },
    HideModal() {
      this.displayCreate = false;
    }
  },
  created: function() {
    let sessionToken = localStorage.getItem("auth");
    if (!sessionToken) {
      this.$router.push({ path: "/" });
    }
  }
};
</script>
