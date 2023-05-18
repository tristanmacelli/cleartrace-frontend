import { defineStore } from "pinia";
import { GroupModal, LocalGroup, LocalUser } from "../types";
import { ComputedRef, Ref, computed, ref } from "vue";

const generalGroup: LocalGroup = {
  id: "5fec04e96d55740010123439",
  name: "General",
  description: "an open channel for all",
  creator: {
    id: -1,
    email: "",
    firstName: "",
    lastName: "",
    photoURL: "",
  },
  members: [],
  private: false,
  messageList: [],
  createdAt: new Date(),
  editedAt: new Date(),
  index: 0,
};

export interface State {
  // A switch for controlling navigation
  // Controls logging output for state actions, mutations, & getters
  activeGroup: Ref<LocalGroup>; // TODO: Add to AppStore
  groupModalData: Ref<{
    group?: LocalGroup;
    type: string;
  }>;
  groupList: Ref<LocalGroup[]>;
  // A fallback in case backend request fails on its initial attempt
  general: Ref<LocalGroup>; // TODO: Add to AppStore
  membersUserData: Ref<LocalUser[]>;
  getActiveGroupID: ComputedRef<string>;
  getGroupModalGroupID: ComputedRef<string | undefined>;
  getGroupListIndex: ComputedRef<number | undefined>;
  getGroupByID: (id: string) => LocalGroup | undefined;
  setActiveGroup: (group: LocalGroup) => void;
  setGroupModalData: (data: GroupModal) => void;
  clearGroupModalData: () => void;
  setGroupList: (list: LocalGroup[]) => void;
  clearGroupList: () => void;
  addToGroupList: (group: LocalGroup) => void;
  removeFromGroupList: (index: number) => void;
  updateGroupInGroupList: (index: number, group: LocalGroup) => void;
}

const useGroupsStore = defineStore("groups", (): State => {
  const activeGroup = ref<LocalGroup>(generalGroup);
  const groupModalData = ref<GroupModal>({
    group: undefined,
    type: "",
  });
  const groupList = ref<LocalGroup[]>([]);
  const general = ref<LocalGroup>(generalGroup);
  const membersUserData = ref<LocalUser[]>([]);

  // Getters
  const getActiveGroupID = computed<string>(() => activeGroup.value.id);

  const getGroupModalGroupID = computed<string | undefined>(
    () => groupModalData.value.group?.id
  );

  const getGroupListIndex = computed<number | undefined>(
    () => groupModalData.value.group?.index
  );

  const getGroupByID = (id: string): LocalGroup | undefined => {
    const index = groupList.value.findIndex((group) => group.id === id);
    if (index > -1) {
      return groupList.value[index];
    } else {
      // if (debug.value) console.log("Group not present");
      console.log("Group not present");
    }
  };
  
  // Mutations
  const setActiveGroup = (group: LocalGroup) => {
    activeGroup.value = group;
  };

  const setGroupModalData = (data: GroupModal) => {
    groupModalData.value = data;
  };

  const clearGroupModalData = () => {
    groupModalData.value = {
      group: undefined,
      type: "",
    };
  };

  const setGroupList = (list: LocalGroup[]) => {
    groupList.value = list;
  };

  const clearGroupList = () => {
    groupList.value = [];
  };

  const addToGroupList = (group: LocalGroup) => {
    groupList.value.push(group);
  };

  const removeFromGroupList = (index: number) => {
    groupList.value.splice(index, 1);
  };

  const updateGroupInGroupList = (index: number, group: LocalGroup) => {
    groupList.value.splice(index, 1);
    groupList.value.splice(index, 0, group);
  };

  return {
    activeGroup,
    groupModalData,
    groupList,
    general,
    membersUserData,
    getActiveGroupID,
    getGroupModalGroupID,
    getGroupListIndex,
    getGroupByID,
    setActiveGroup,
    setGroupModalData,
    clearGroupModalData,
    setGroupList,
    clearGroupList,
    addToGroupList,
    removeFromGroupList,
    updateGroupInGroupList,
  };
});

export default useGroupsStore;
