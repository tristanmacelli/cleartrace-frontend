<template>
  <Modal :Title="title" Description=" " @hide-modal="HideModal">
    <form
      v-on:submit.prevent="SubmitForm"
      accept-charset="UTF-8"
      class="grid gap-y-2 w-full"
    >
      <!-- This slot allows for a Update Group modal -->
      <input
        v-if="isModalTypeUpdate"
        class="w-full p-2 border border-solid border-gray-200 focus:outline-none shadow-inner rounded-md"
        v-model="nameInput"
        type="text"
      />
      <input
        v-if="isModalTypeUpdate"
        class="w-full p-2 border border-solid border-gray-200 focus:outline-none shadow-inner rounded-md"
        v-model="descriptionInput"
        type="text"
      />
      <input
        class="w-full p-2 border border-solid border-gray-200 focus:outline-none shadow-inner rounded-md"
        v-model="query"
        type="text"
        placeholder="Search for a Friend!"
      />
      <h4 class="font-bold h-8 text-center">Members:</h4>
      <div class="flex flex-wrap gap-y-1 max-h-32 overflow-y-auto">
        <group-member
          v-for="(name, index) in memberNames"
          :key="index"
          :index="index"
          :name="name"
          @remove="RemoveGroupMember"
        >
        </group-member>
      </div>
      <input
        v-if="!isModalTypeUpdate"
        class="w-full px-16 py-2 bg-blue-500 font-bold text-white cursor-pointer rounded-md"
        type="submit"
        value="Create"
      />
      <!-- This slot allows for a Update Group modal (Delete group button here) -->
      <input
        v-if="isModalTypeUpdate"
        class="w-full px-16 py-2 bg-red-500 font-bold text-white cursor-pointer rounded-md"
        type="submit"
        value="Delete"
      />
    </form>
    <list
      class="overflow-y-auto"
      @active-list-item="AddGroupMember"
      v-if="showResults"
      :positionRight="false"
      :items="searchResults"
    >
    </list>
  </Modal>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "groupModal",
});
</script>

<script lang="ts" setup>
// @ is an alias to /src
import List from "@/components/List.vue";
import GroupMember from "@/components/GroupMember.vue";
import Modal from "@/components/Modal.vue";
import { ref, watch } from "vue";
import { Groups } from "@/api/messaging.service";
import { Search } from "@/api/users";

const {
  descriptionInput,
  general,
  groupModalData,
  isModalTypeUpdate,
  members,
  memberNames,
  nameInput,
  CreateGroup,
  DeleteGroup,
  AddGroupMember,
  RemoveGroupMember,
} = Groups();
const { searchResults, query, users, userIDs, GetUsersFromIDs } = Search();

const emit = defineEmits(["hideModal"]);

const showResults = ref(false);
let title = "New Group";

if (isModalTypeUpdate && groupModalData.value.group) {
  let group = groupModalData.value.group;
  descriptionInput.value = group.description!;
  nameInput.value = group.name;
  title = "Update Group";
  userIDs.value = group.members;
  await GetUsersFromIDs();
  members.value = users.value;
  group = general.value;
}

const DisplayResults = () => {
  showResults.value = true;
};

const HideResults = () => {
  showResults.value = false;
};

const HideModal = () => {
  emit("hideModal");
};

const SubmitForm = async () => {
  if (groupModalData.value.type == "create") {
    await CreateGroup();
  } else {
    await DeleteGroup();
  }
  HideModal();
};

watch(query, (curVal) => {
  if (curVal != "") {
    DisplayResults();
  }
});

watch(memberNames, (curVal, oldVal) => {
  if (curVal.length > oldVal.length) {
    query.value = "";
    HideResults();
  }
});
</script>
