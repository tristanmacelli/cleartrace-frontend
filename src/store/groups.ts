import { defineStore } from "pinia";
// import { defineStore, storeToRefs } from "pinia";
import { GroupModal, LocalGroup, LocalUser } from "../types";
import { ComputedRef, Ref, computed, ref } from "vue";
// import usePiniaStore from "./pinia";
// import { Users } from "@/api/users";

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
  previousActiveGroup: Ref<LocalGroup>; // TODO: Add to AppStore
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
  getMembersUserIDs: ComputedRef<number[]>;
  getGroupByID: (id: string) => LocalGroup | undefined;
  setActiveGroup: (group: LocalGroup, initialCall?: boolean) => void;
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
  const previousActiveGroup = ref<LocalGroup>(generalGroup);
  const groupModalData = ref<GroupModal>({
    group: undefined,
    type: "",
  });
  const groupList = ref<LocalGroup[]>([]);
  const general = ref<LocalGroup>(generalGroup);
  const membersUserData = ref<LocalUser[]>([]);
  // const pinia = usePiniaStore();
  // const { user } = storeToRefs(pinia);
  // const { GetUserById } = Users();

  // Getters
  const getActiveGroupID = computed<string>(() => activeGroup.value.id);

  const getGroupModalGroupID = computed<string | undefined>(
    () => groupModalData.value.group?.id
  );

  const getGroupListIndex = computed<number | undefined>(
    () => groupModalData.value.group?.index
  );

  const getMembersUserIDs = computed<number[]>(() =>
    membersUserData.value.map((m) => m.id)
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

  // TODO
  // const getMemberUserDataById = async (
  //   id: number
  // ): Promise<LocalUser | undefined> => {
  //   const index = membersUserData.value.findIndex((user) => user.id === id);
  //   if (index > -1) {
  //     return membersUserData.value[index];
  //   } else {
  //     const { user, error } = await GetUserById(id);
  //     if (error || !user) return;
  //     return user;
  //   }
  // };

  // const getMembersNames = async (members: number[]) => {
  //   const ids = members.filter((id) => id !== user.value!.id);
  //   const names = ids.map(async (id) => {
  //     const user = await getMemberUserDataById(id);
  //     if (user) {
  //       return `${user.firstName} ${user.lastName}`;
  //     }
  //     return "";
  //   });
  //   return names;
  // };

  // Mutations

  // When calling setActiveGroup for the first time, the "previous" group should still remain General
  // to ensure the previous group is populated with messages in case the user leaves/deletes all
  // their groups and never revists the general group
  const setActiveGroup = (group: LocalGroup, initialCall?: boolean) => {
    previousActiveGroup.value = initialCall ? group : activeGroup.value;
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
    previousActiveGroup,
    groupModalData,
    groupList,
    general,
    membersUserData,
    getActiveGroupID,
    getGroupModalGroupID,
    getGroupListIndex,
    getMembersUserIDs,
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
