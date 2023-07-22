<template>
  <Modal
    :Title="title"
    :Description="
      inputDisabled ? 'Heads Up: Only group creators can make updates' : ''
    "
    @hide-modal="HideModal"
  >
    <form accept-charset="UTF-8" class="grid gap-y-2 w-full">
      <!-- This slot allows for a Update Group modal -->
      <input
        v-if="isModalTypeUpdate"
        class="w-full p-2 border border-solid border-gray-200 focus:outline-none shadow-inner rounded-md"
        v-model="nameInput"
        type="text"
        :disabled="inputDisabled"
      />
      <input
        v-if="isModalTypeUpdate"
        class="w-full p-2 border border-solid border-gray-200 focus:outline-none shadow-inner rounded-md"
        v-model="descriptionInput"
        type="text"
        :disabled="inputDisabled"
      />
      <input
        class="w-full p-2 border border-solid border-gray-200 focus:outline-none shadow-inner rounded-md"
        v-model="query"
        type="text"
        placeholder="Search for a Friend to add!"
        :disabled="inputDisabled"
      />
      <list
        class="overflow-y-auto"
        @active-list-item="AddMember"
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
      <h4 class="font-bold h-8 text-center">Members:</h4>
      <div class="flex flex-wrap gap-y-1 max-h-32 overflow-y-auto">
        <group-member
          v-for="(name, index) in memberNames"
          :key="index"
          :index="index"
          :name="name"
          :disabled="inputDisabled"
          @remove="RemoveGroupMember"
        >
        </group-member>
      </div>
      <input
        @click.prevent="SubmitForm('create')"
        v-if="!isModalTypeUpdate"
        class="w-full px-16 py-2 bg-blue-500 font-bold text-white cursor-pointer rounded-md"
        type="submit"
        value="Create"
      />
      <!-- This slot allows for a Update Group modal (Delete group button here) -->
      <input
        @click.prevent="SubmitForm('leave')"
        v-if="isModalTypeUpdate && leavableGroup"
        class="w-full px-16 py-2 bg-white border-2 border-red-500 font-bold text-red-500 cursor-pointer rounded-md"
        type="submit"
        value="Leave Group"
      />
      <input
        @click.prevent="SubmitForm('delete')"
        v-if="isModalTypeUpdate"
        class="w-full px-16 py-2 font-bold text-white cursor-pointer rounded-md"
        :class="inputDisabled ? 'bg-red-500' : 'bg-gray-300'"
        type="submit"
        value="Delete Group"
        :disabled="inputDisabled"
      />
    </form>
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
import { computed, ref, watch } from "vue";
import usePiniaStore from "@/store/pinia";
import { Groups } from "@/api/messaging.service";
import { Search } from "@/api/users";
import useGroupsStore from "@/store/groups";
import { storeToRefs } from "pinia";
import { UserSearchResult } from "@/types";
import { userSearchResultToMember } from "@/utils";

const {
  descriptionInput,
  isModalTypeUpdate,
  members,
  memberNames,
  nameInput,
  CreateGroup,
  DeleteGroup,
  LeaveGroup,
  AddGroupMember,
  RemoveGroupMember,
} = Groups();
const { searchResults, query, users, userIDs, GetUsersFromIDs } = Search();
const pinia = usePiniaStore();
const groupsStore = useGroupsStore();
const { groupModalData } = storeToRefs(groupsStore);
const { getUserID } = storeToRefs(pinia);

const emit = defineEmits(["hideModal"]);

const showResults = ref(false);
let title = "New Group";
const isGroupCreator =
  groupModalData.value.group?.creator.id === getUserID.value;
const inputDisabled = !isGroupCreator && isModalTypeUpdate;

const pending = computed(
  () => query.value.length > 0 && searchResults.value.length === 0
);

if (isModalTypeUpdate && groupModalData.value.group) {
  let group = groupModalData.value.group;
  descriptionInput.value = group.description!;
  nameInput.value = group.name;
  title = "Update Group";
  userIDs.value = group.members;
  await GetUsersFromIDs();
  const currentMembers = users.value.filter((u) => u.id != getUserID.value);

  members.value = currentMembers;
}

const leavableGroup = computed(() => members.value.length > 2);

const DisplayResults = () => {
  showResults.value = true;
};

const HideResults = () => {
  showResults.value = false;
};

const HideModal = () => {
  emit("hideModal");
};

const AddMember = (userResult: UserSearchResult) => {
  const newMember = userSearchResultToMember(userResult);
  AddGroupMember(newMember);
};

const SubmitForm = async (type: string) => {
  switch (type) {
    case "create": {
      await CreateGroup();
      break;
    }
    case "leave": {
      await LeaveGroup();
      break;
    }
    case "delete": {
      await DeleteGroup();
      break;
    }
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
