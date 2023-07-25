<template>
  <Modal
    Title="Update Group"
    :Description="
      inputDisabled ? 'Heads Up: Only group creators can make updates' : ''
    "
    @hide-modal="HideModal"
  >
    <form accept-charset="UTF-8" class="grid gap-y-2 w-full">
      <!-- This slot allows for a Update Group modal -->
      <input
        class="w-full p-2 border border-solid border-gray-200 focus:outline-none shadow-inner rounded-md"
        v-model="nameInput"
        type="text"
        :disabled="inputDisabled"
      />
      <input
        class="w-full p-2 border border-solid border-gray-200 focus:outline-none shadow-inner rounded-md"
        v-model="descriptionInput"
        type="text"
        :disabled="inputDisabled"
      />
      <UserSearch v-if="showSearchComponent" @selected-user="AddMember" />
      <h4 class="font-bold h-8 text-center">People:</h4>
      <div class="flex flex-wrap gap-y-1 max-h-32 overflow-y-auto">
        <group-member
          v-for="(member, index) in currentMembers"
          :key="index"
          :index="index"
          :name="member.name"
          :disabled="inputDisabled || currentMembers.length < 2"
          @remove="RemoveMember"
        >
        </group-member>
      </div>
      <!-- This slot allows for a Update Group modal (Delete group button here) -->
      <input
        @click.prevent="SubmitForm('leave')"
        v-if="leavableGroup"
        class="w-full px-16 py-2 bg-white border-2 border-red-500 font-bold text-red-500 cursor-pointer rounded-md"
        type="submit"
        value="Leave Group"
      />
      <input
        @click.prevent="SubmitForm('delete')"
        v-if="!inputDisabled"
        class="w-full px-16 py-2 font-bold text-white bg-red-500 cursor-pointer rounded-md"
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
  name: "groupDetails",
});
</script>

<script lang="ts" setup>
import { computed, ref, watch } from "vue";
import { storeToRefs } from "pinia";
import GroupMember from "@/components/GroupMember.vue";
import UserSearch from "@/components/UserSearch.vue";
import Modal from "@/components/Modal.vue";
import { Groups } from "@/api/messaging.service";
import { Search } from "@/api/users";
import usePiniaStore from "@/store/pinia";
import useGroupsStore from "@/store/groups";
import useMessageStore from "@/store/messages";
import { LocalGroup, Member, UserSearchResult } from "@/types";
import { userSearchResultToMember } from "@/utils";

const {
  DeleteGroup,
  LeaveGroup,
  UpdateGroupDetails,
  AddGroupMember,
  RemoveGroupMember,
} = Groups();
const { GetUsersFromIDs } = Search();
const pinia = usePiniaStore();
const groupsStore = useGroupsStore();
const messageStore = useMessageStore();
const { getUserID } = storeToRefs(pinia);
const { previousActiveGroup } = storeToRefs(groupsStore);

const props = defineProps<{
  group: LocalGroup;
}>();
const emit = defineEmits(["hideModal"]);

// Form Input
const descriptionInput = ref(props.group.description);
const nameInput = ref(props.group.name);

const currentMembers = ref<Member[]>([]);
// DOM control
const inputDisabled = props.group.creator.id !== getUserID.value;
const showSearchComponent = computed(() => {
  return !inputDisabled && currentMembers.value.length > 1;
});
// More DOM Control
const { members } = await GetUsersFromIDs(props.group.members);
if (members) {
  // Remove current user from the current member list
  currentMembers.value = members.filter((u) => u.id != getUserID.value);
}
const leavableGroup = computed(() => currentMembers.value.length > 2);

const awaitingGroupDetails = ref<boolean>(false);

const updateDetailsWatchHandler = (oldValue: string) => {
  // Don't update when previous was empty
  if (oldValue === "") {
    return;
  }
  if (!awaitingGroupDetails.value) {
    setTimeout(() => {
      UpdateGroupDetails(props.group, nameInput.value, descriptionInput.value);
      awaitingGroupDetails.value = false;
    }, 1000); // 1 sec delay
  }
  awaitingGroupDetails.value = true;
};

watch(nameInput, (_, oldValue) => updateDetailsWatchHandler(oldValue));
watch(descriptionInput, (_, oldValue) => updateDetailsWatchHandler(oldValue));

const AddMember = async (userResult: UserSearchResult) => {
  const newMember = userSearchResultToMember(userResult);
  // Adding the group member remotely
  const { updatedGroup } = await AddGroupMember(
    props.group,
    currentMembers.value,
    newMember
  );

  // Adding the group member locally
  if (updatedGroup) {
    currentMembers.value.push(newMember);
    groupsStore.updateGroupInGroupList(props.group.index, updatedGroup);
  }
};

const RemoveMember = async (memberIndex: number) => {
  // Removing the group member remotely
  const { updatedGroup } = await RemoveGroupMember(
    props.group,
    currentMembers.value,
    memberIndex
  );

  // Removing the group member locally
  if (updatedGroup) {
    currentMembers.value.splice(memberIndex, 1);
    groupsStore.updateGroupInGroupList(props.group.index, updatedGroup);
  }
};

const SetPreviousGroupToActive = () => {
  groupsStore.setActiveGroup(previousActiveGroup.value);
  const messageList = messageStore.getMessageList(
    previousActiveGroup.value.id!
  );
  messageStore.setActiveMessageList(messageList!);
};

const HideModal = () => {
  emit("hideModal");
};

const SubmitForm = async (type: string) => {
  switch (type) {
    case "leave": {
      const { index, error } = await LeaveGroup(
        props.group.id,
        props.group.index
      );
      if (!index || error) {
        // TODO: do something to the DOM
      } else {
        groupsStore.removeFromGroupList(props.group.index);
        SetPreviousGroupToActive();
      }
      break;
    }
    case "delete": {
      const { index, error } = await DeleteGroup(
        props.group.id,
        props.group.index
      );
      if (!index || error) {
        // TODO: do something to the DOM
      } else {
        groupsStore.removeFromGroupList(props.group.index);
        SetPreviousGroupToActive();
      }
      break;
    }
  }
  HideModal();
};
</script>
