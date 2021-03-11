<template>
  <div
    id="home"
    class="h-screen w-screen bg-cover flex flex-nowrap items-center justify-center"
  >
    <div class="w-screen h-screen">
      <Suspense>
        <MessageList></MessageList>
      </Suspense>
      <Suspense>
        <GroupList @display-modal="this.DisplayModal"></GroupList>
      </Suspense>
    </div>
    <GroupModal v-if="this.displayModal" @hide-modal="HideModal"></GroupModal>
  </div>
</template>

<script>
// @ is an alias to /src
import GroupList from "@/components/GroupList.vue";
import GroupModal from "@/components/GroupModal.vue";
import MessageList from "@/components/MessageList.vue";
import { Groups } from "@/api/messaging.service";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { onErrorCaptured, ref } from "vue";

export default {
  name: "Home",
  components: {
    GroupList,
    GroupModal,
    MessageList
  },
  async setup() {
    const store = useStore();
    const router = useRouter();
    const { GetGeneralGroup } = Groups();
    const error = ref(null);
    onErrorCaptured(caughtError => {
      error.value = caughtError;
      return true;
    });
    // This handles page refreshes or navigating back to the website
    // during an active/expired session
    let sessionToken = localStorage.getItem("auth");
    if (!sessionToken) {
      router.push({ path: "/" });
    }

    await GetGeneralGroup();
    await store.dispatch("setSocket");
    await store.dispatch("setUser");

    const displayModal = ref(false);
    const modalType = ref("");
    const DisplayModal = () => {
      displayModal.value = true;
    };
    const HideModal = () => {
      displayModal.value = false;
    };

    return { error, displayModal, modalType, DisplayModal, HideModal };
  }
};
</script>
