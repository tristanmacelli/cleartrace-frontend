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
    <div class="grid w-12 h-12 justify-self-center">
      <img
        v-if="pending"
        src="../assets/loading-spinner.svg"
        width="48"
        height="48"
      />
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
const { searchResults, SearchUsers } = Search();

const emit = defineEmits(["selectedUser"]);

const query = ref<string>("");
const showResults = ref(false);
const awaitingSearch = ref<boolean>(false);
const pending = computed(
  () => query.value.length > 0 && searchResults.value.length === 0
);

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

watch(query, () => {
  if (!awaitingSearch.value) {
    setTimeout(() => {
      SearchUsers(query.value);
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
</script>
