<template>
  <Modal :Title="this.title" Description=" " @hide-modal="HideModal">
    <form
      v-on:submit.prevent="SubmitForm"
      accept-charset="UTF-8"
      class="grid gap-y-2 w-full"
    >
      <!-- This slot allows for a Update Group modal -->
      <input
        v-if="isModalTypeUpdate"
        class="w-full p-2 border border-solid border-gray-200 focus:outline-none shadow-inner rounded-md"
        v-model="group.name"
        type="text"
      />
      <input
        v-if="isModalTypeUpdate"
        class="w-full p-2 border border-solid border-gray-200 focus:outline-none shadow-inner rounded-md"
        v-model="group.description"
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
          @remove="this.RemoveGroupMember"
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
      @active-list-item="this.AddGroupMember"
      v-if="this.showResults"
      :positionRight="false"
      :items="this.searchResults"
    >
    </list>
  </Modal>
</template>

<script>
// @ is an alias to /src
import List from "@/components/List.vue";
import GroupMember from "@/components/GroupMember.vue";
import Modal from "@/components/Modal.vue";
// import { CreateGroup, UpdateGroupDetails, DeleteGroup, AddGroupMember, RemoveGroupMember } from "@/api/messaging.service.js";
import { computed, ref } from "vue";
import { Groups } from "@/api/messaging.service";
import { Search } from "@/api/users";

export default {
  name: "groupModal",
  components: {
    List,
    GroupMember,
    Modal
  },
  async setup() {
    const {
      group,
      groupBuffer,
      members,
      memberNames,
      CreateGroup,
      DeleteGroup,
      UpdateGroupDetails,
      AddGroupMember,
      RemoveGroupMember
    } = Groups();
    const {
      searchResults,
      query,
      users,
      userIDs,
      SearchUsers,
      GetUsersFromIDs
    } = Search();
    const isModalTypeUpdate = groupBuffer.value.type === "update";
    const showResults = ref(false);
    const title = computed(() =>
      isModalTypeUpdate ? "Update " + group.value.name : "New Group"
    );
    group.value = groupBuffer.value.group;
    userIDs.value = group.value.members;

    if (isModalTypeUpdate) {
      await GetUsersFromIDs();
      members.value = users.value;
    }

    return {
      group,
      groupBuffer,
      isModalTypeUpdate,
      members,
      memberNames,
      showResults,
      title,
      CreateGroup,
      DeleteGroup,
      UpdateGroupDetails,
      AddGroupMember,
      RemoveGroupMember,
      searchResults,
      query,
      users,
      SearchUsers,
      GetUsersFromIDs
    };
  },
  emits: ["hideModal"],
  watch: {
    query(curVal) {
      if (curVal != "") {
        this.DisplayResults();
      }
    },
    members(curVal, oldVal) {
      if (curVal.length > oldVal.length) {
        this.HideResults();
      }
    }
  },
  methods: {
    DisplayResults() {
      this.showResults = true;
    },
    HideResults() {
      this.showResults = false;
    },
    HideModal() {
      this.$emit("hideModal");
    },
    async SubmitForm() {
      if (this.groupBuffer.type == "create") {
        await this.CreateGroup();
      } else {
        await this.DeleteGroup();
      }
      this.HideModal();
    }
  }
};
</script>
