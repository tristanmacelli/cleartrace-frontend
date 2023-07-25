<template>
  <div class="grid w-full">
    <input
      class="w-full p-2 border border-solid border-gray-200 focus:outline-none shadow-inner rounded-md"
      v-model="query"
      type="text"
      placeholder="Search for a Friend to add!"
    />
    <list
      class="overflow-y-auto"
      @active-list-item="SelectedUser"
      v-if="showResults"
      :positionRight="false"
      :items="searchResults"
    >
    </list>
    <!-- The following div is a spacer to prevent the component from resizing -->
    <div v-if="!showNoResultsMessage && !pending" class="h-12"></div>
    <p v-if="showNoResultsMessage" class="h-12 pt-4 justify-self-center">
      No Search Results :/
    </p>
    <div v-if="pending" class="grid w-12 h-12 justify-self-center">
      <img src="../assets/loading-spinner.svg" width="48" height="48" />
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { UserSearchResult } from "@/types";

export default defineComponent({
  name: "userSearch",
});
</script>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import List from "@/components/List.vue";
import { Search } from "@/api/users";
const { SearchUsers } = Search();

const emit = defineEmits(["selectedUser"]);

const query = ref<string>("");
const searchResults = ref<UserSearchResult[]>([]);
const awaitingSearch = ref<boolean>(false);
const pending = computed(() => query.value.length > 0 && awaitingSearch.value);
const showResults = ref(false);
const showNoResultsMessage = ref(false);

const DisplayResults = () => {
  showResults.value = true;
};

const HideResults = () => {
  showResults.value = false;
};

const SelectedUser = (userResult: UserSearchResult) => {
  emit("selectedUser", userResult);
  HideResults();
  query.value = "";
};

// Debounce search requests.
// setTimeout delays the execution of the passed callback by the amount of milliseconds passed.
watch(query, () => {
  if (!awaitingSearch.value) {
    setTimeout(async () => {
      // Clear results on a new search
      searchResults.value = [];
      const { results } = await SearchUsers(query.value);
      if (results) searchResults.value = results;
      awaitingSearch.value = false;
    }, 1000); // 1 sec delay
  }
  awaitingSearch.value = true;
});

watch(query, (curVal) => {
  if (curVal != "") {
    DisplayResults();
  }
});

watch(pending, (newPending, oldPending) => {
  if (
    oldPending &&
    !newPending &&
    searchResults.value.length === 0 &&
    query.value.length > 0
  ) {
    showNoResultsMessage.value = true;
  } else {
    showNoResultsMessage.value = false;
  }
});
</script>
