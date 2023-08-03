<template>
  <Modal Title="New Group" Description="" @hide-modal="HideModal">
    <form accept-charset="UTF-8" class="grid gap-y-2 w-full">
      <UserSearch @selected-user="AddMember" />
      <h4 class="font-bold h-8 text-center">People:</h4>
      <div class="flex flex-wrap gap-y-1 max-h-32 overflow-y-auto">
        <group-member
          v-for="(member, index) in currentMembers"
          :key="index"
          :index="index"
          :name="member.name"
          :disabled="false"
          @remove="RemoveMember"
        >
        </group-member>
      </div>
      <input
        @click.prevent="SubmitForm()"
        class="w-full px-16 py-2 bg-blue-500 font-bold text-white cursor-pointer rounded-md"
        type="submit"
        value="Create"
      />
    </form>
  </Modal>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import { storeToRefs } from "pinia";

export default defineComponent({
  name: "createGroupModal",
});
</script>

<script lang="ts" setup>
import { ref } from "vue";
import GroupMember from "@/components/GroupMember.vue";
import UserSearch from "@/components/UserSearch.vue";
import Modal from "@/components/Modal.vue";
import usePiniaStore from "@/store/pinia";
import useGroupsStore from "@/store/groups";
import useMessageStore from "@/store/messages";
import { Groups } from "@/api/messaging.service";
import { Member, MessageList, UserSearchResult } from "@/types";
import { createLocalGroupName, userSearchResultToMember } from "@/utils";

const { CreateGroup } = Groups();
const pinia = usePiniaStore();
const groupsStore = useGroupsStore();
const messageStore = useMessageStore();
const { debug, getUserFullName } = storeToRefs(pinia);

const emit = defineEmits(["hideModal"]);
const currentMembers = ref<Member[]>([]);

//
const AddMember = (userResult: UserSearchResult) => {
  const newMember = userSearchResultToMember(userResult);
  // Don't add duplicate members
  if (currentMembers.value.findIndex((m) => m.id === newMember.id) > -1) {
    return;
  }
  currentMembers.value.push(newMember);
};

const RemoveMember = (memberIndex: number) => {
  currentMembers.value.splice(memberIndex, 1);
};

const HideModal = () => {
  emit("hideModal");
};

const SubmitForm = async () => {
  const { newGroup, error } = await CreateGroup(currentMembers.value);
  if (!newGroup || error) {
    if (debug.value) console.error("Error creating new group");
    // TODO: do something to the DOM
  } else {
    const localName = createLocalGroupName(
      newGroup.name,
      getUserFullName.value!
    );
    const localGroup = { ...newGroup, name: localName };
    groupsStore.addToGroupList(localGroup);
    groupsStore.setSortedGroupList();
    groupsStore.setActiveGroup(localGroup);
    const newMessageList: MessageList = {
      channelID: newGroup.id,
      messages: [],
      unreadMessages: [],
    };
    messageStore.setActiveMessageList(newMessageList);
    HideModal();
  }
};
</script>
