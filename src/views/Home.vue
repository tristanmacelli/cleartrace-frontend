<template>
  <div
    id="home"
    class="h-screen w-screen bg-cover flex flex-nowrap items-center justify-center"
  >
    <div class="w-screen h-screen">
      <MessageList></MessageList>
      <GroupList @display-modal="this.DisplayModal"></GroupList>
    </div>
    <GroupModal v-if="this.displayModal" @hide-modal="HideModal"></GroupModal>
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
      displayModal: false,
      modalGroup: "",
      modalType: ""
    };
  },
  methods: {
    DisplayModal() {
      this.displayModal = true;
    },
    HideModal() {
      this.displayModal = false;
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
