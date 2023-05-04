<template>
  <div
    id="home"
    class="h-screen w-screen bg-cover flex flex-nowrap items-center justify-center"
  >
    <div class="w-screen h-screen overflow-hidden">
      <div v-if="error" class="text-center text-2xl mt-20">
        {{ error }}
      </div>
      <Suspense v-else>
        <template #default>
          <div>
            <MessageList />
            <GroupList @display-modal="this.DisplayModal" />
          </div>
        </template>
        <template #fallback>
          <div>Loading...</div>
        </template>
      </Suspense>
    </div>
    <Suspense>
      <GroupModal v-if="this.displayModal" @hide-modal="HideModal" />
    </Suspense>
  </div>
</template>

<script>
// @ is an alias to /src
import { Groups } from "@/api/messaging.service";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import { defineAsyncComponent, onErrorCaptured, ref } from "vue";

export default {
  name: "HomeView",
  components: {
    GroupList: defineAsyncComponent(() =>
      import("../components/GroupList.vue")
    ),
    GroupModal: defineAsyncComponent(() =>
      import("../components/GroupModal.vue")
    ),
    MessageList: defineAsyncComponent(() =>
      import("../components/MessageList.vue")
    ),
  },
  async setup() {
    const store = useStore();
    const router = useRouter();
    const { GetGeneralGroup } = Groups();
    const displayModal = ref(false);
    const error = ref(null);
    const modalType = ref("");

    onErrorCaptured((caughtError) => {
      error.value = caughtError;
      return true;
    });
    // This handles page refreshes or navigating back to the website
    // during an active/expired session
    let sessionToken = localStorage.getItem("auth");
    if (!sessionToken) {
      router.push({ path: "/" });
    }

    const getGeneralGroup = GetGeneralGroup();
    const setSocket = store.dispatch("setSocket");
    const setUser = store.dispatch("setUser");
    await Promise.all([getGeneralGroup, setSocket, setUser]);

    const DisplayModal = () => {
      displayModal.value = true;
    };
    const HideModal = () => {
      displayModal.value = false;
    };

    return { error, displayModal, modalType, DisplayModal, HideModal };
  },
};
</script>
