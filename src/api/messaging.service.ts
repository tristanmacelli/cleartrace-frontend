import axios from "axios";

import { computed, ref, watch } from "vue";
import { LocalGroup, LocalMessage, Member, ServerMessage } from "../types";
import { FormatDate, serverToClientMessage, serverToClientUser } from "@/utils";
import usePiniaStore from "@/store/pinia";

export const Messages = () => {
  const pinia = usePiniaStore();
  const bodyInput = ref("");
  const activeGroup = computed(() => pinia.activeGroup);
  const messageList = ref<LocalMessage[]>([]);
  const serverURL = computed(() => pinia.serverURL);
  const user = computed(() => pinia.user);

  const GetMessages = async (id: string = activeGroup.value.id) => {
    const url = serverURL.value + "v1/channels/" + id;
    const sessionToken = localStorage.getItem("auth");

    await axios
      .get(url, {
        headers: {
          Authorization: sessionToken,
        },
      })
      .then((response) => {
        const messages = response.data;
        if (!messages) {
          return;
        }
        messageList.value = [];
        messages
          .slice()
          .reverse()
          .forEach((message: ServerMessage) => {
            messageList.value.push(serverToClientMessage(message));
          });
      })
      .catch((error) => {
        alert(error);
      });
  };

  const SendMessage = async () => {
    const url = serverURL.value + "v1/channels/" + activeGroup.value.id;
    const sessionToken = localStorage.getItem("auth");
    const date = new Date();
    const formattedDate = FormatDate(date);

    const localMessage: LocalMessage = {
      channelID: activeGroup.value.id,
      body: bodyInput.value,
      createdAt: date,
      createdAtTime: formattedDate,
      creator: user.value!,
    };
    // Setting the msg id locally to -1 (will self-correct on page refresh)
    messageList.value.push(localMessage);

    axios
      .post(url, localMessage, {
        headers: {
          Authorization: sessionToken,
        },
      })
      .then(() => {
        bodyInput.value = "";
      })
      .catch((error) => {
        alert(error);
      });
  };

  return {
    bodyInput,
    activeGroup,
    messageList,
    GetMessages,
    SendMessage,
  };
};

export const Groups = () => {
  const pinia = usePiniaStore();
  const awaitingGroupDetails = ref(false);
  const descriptionInput = ref("");
  const groupModalData = computed(() => pinia.groupModalData);
  const groupID = computed(() => pinia.groupModalData.group?.id);
  const groupList = computed(() => pinia.groupList);
  const index = computed(() => pinia.groupModalData.group?.index);
  const isModalTypeUpdate = groupModalData.value.type === "update";
  const members = ref<Member[]>([]);
  const memberIDs = ref<number[]>([]);
  const memberNames = ref<string[]>([]);
  const nameInput = ref("");
  const serverURL = computed(() => pinia.serverURL);

  const getMemberIDs = () => {
    const ids: number[] = [];
    members.value.forEach((member) => ids.push(member.id));
    return ids;
  };

  const updateDetailsWatchHandler = (oldValue: any) => {
    // Don't update when previous was empty
    if (oldValue === "") {
      return;
    }
    if (!awaitingGroupDetails.value) {
      setTimeout(() => {
        UpdateGroupDetails();
        awaitingGroupDetails.value = false;
      }, 1000); // 1 sec delay
    }
    awaitingGroupDetails.value = true;
  };

  if (isModalTypeUpdate) {
    watch(nameInput, (_, oldValue) => updateDetailsWatchHandler(oldValue));
    watch(descriptionInput, (_, oldValue) =>
      updateDetailsWatchHandler(oldValue)
    );
  }

  watch(
    members,
    () => {
      memberIDs.value = [];
      memberNames.value = [];
      members.value.forEach((member) => memberIDs.value.push(member.id));
      members.value.forEach((member) => memberNames.value.push(member.name));
    },
    {
      deep: true,
    }
  );

  const GetSpecificGroup = async (groupName: string) => {
    const url = serverURL.value + "v1/channels?startsWith=" + groupName;
    const sessionToken = localStorage.getItem("auth");

    const groups = await axios
      .get(url, {
        headers: {
          Authorization: sessionToken,
        },
      })
      .then((response) => {
        return response.data;
      })
      .catch((error) => {
        if (pinia.debug) alert(`Error getting specific group: ${error}`);
      });
    return groups;
  };

  const CreateGroup = async () => {
    if (members.value.length == 0) {
      alert("Error: Invalid New Group Input");
      return;
    }
    const url = serverURL.value + "v1/channels";
    const sessionToken = localStorage.getItem("auth");

    const names = memberNames.value.toString();
    const ids = memberIDs.value;
    const date = new Date();
    const groupObject = {
      name: names,
      description: "*Enter a description*",
      private: true,
      members: ids,
      createdAt: date,
      editedAt: undefined,
    };
    const headers = { Authorization: sessionToken };
    const requestConfig = {
      method: "post",
      url: url,
      headers: headers,
      data: groupObject,
    };
    await axios(requestConfig)
      .then((response) => {
        const newGroup: LocalGroup = {
          index: groupList.value.length,
          ...response.data,
        };
        pinia.addToGroupList(newGroup);
        // store.commit("addToGroupList", {
        //   group: newGroup,
        // });
      })
      .catch((error) => {
        alert(error);
      });
  };

  const GetGroups = async () => {
    const { messageList, GetMessages } = Messages();
    const url = serverURL.value + "v1/channels";
    const sessionToken = localStorage.getItem("auth");

    await axios
      .get(url, {
        headers: {
          Authorization: sessionToken,
        },
      })
      .then(async (response) => {
        if (response == null) {
          return;
        }
        pinia.groupList = [];
        // store.commit("clearGroupList");
        const receivedGroups: LocalGroup[] = [];
        const rawGroupData = response.data.slice().reverse();

        let i = 0;
        for (const group of rawGroupData) {
          const retrieveAndStoreMessageList = i < pinia.groupMessageListLimit;
          if (retrieveAndStoreMessageList) {
            await GetMessages(group.id);
          }

          // Query full users present new groups that are not in userData: user[]
          const localGroup: LocalGroup = {
            ...group,
            index: i,
            messageList: retrieveAndStoreMessageList ? messageList.value : [],
            creator: serverToClientUser(group.creator),
          };
          receivedGroups.push(localGroup);
          i++;
        }

        pinia.groupList = receivedGroups;
        // store.commit("setGroupList", {
        //   groupList: receivedGroups,
        // });
      })
      .catch((error) => {
        if (pinia.debug) alert(error);
      });
  };

  const UpdateGroupDetails = async () => {
    const url = serverURL.value + "v1/channels/" + groupID.value;
    const sessionToken = localStorage.getItem("auth");
    const body = {
      name: nameInput.value,
      description: descriptionInput.value,
    };

    axios
      .patch(url, body, {
        headers: {
          Authorization: sessionToken,
        },
      })
      .then((response) => {
        const updatedGroup = response.data;
        updatedGroup.index = index.value;

        pinia.updateGroupInGroupList(index.value!, updatedGroup);
        // store.commit("updateGroupInGroupList", {
        //   index: index.value,
        //   group: updatedGroup,
        // });
      })
      .catch((error) => {
        alert(error);
      });
  };

  const LeaveGroup = async () => {
    if (!confirm("Are you sure you want to leave this group?")) {
      return;
    }
    const currentUserId = pinia.user?.id;
    const url = serverURL.value + "v1/channels/" + groupID.value + "/members";
    const sessionToken = localStorage.getItem("auth");
    const data = {
      id: currentUserId,
    };
    const headers = {
      Authorization: sessionToken,
    };
    axios
      .delete(url, {
        headers,
        data,
      })
      .then(() => {
        if (!groupModalData.value.group) return;

        pinia.removeFromGroupList(index.value!);
        // store.commit("removeFromGroupList", {
        //   index: index.value,
        // });
      })
      .catch((error) => {
        alert(error);
      });
  };

  const DeleteGroup = async () => {
    if (!confirm("Are you sure you want to delete this group?")) {
      return;
    }
    const url = serverURL.value + "v1/channels/" + groupID.value;
    const sessionToken = localStorage.getItem("auth");
    axios
      .delete(url, {
        headers: {
          Authorization: sessionToken,
        },
      })
      .then(() => {
        // Go back to the general group when deleting the channel
        // const general = store.getters.getGroupByID(store.state.general.id);
        const general = pinia.getGroupByID(pinia.general.id);

        pinia.activeGroup = general!;
        pinia.removeFromGroupList(index.value!);
        // store.commit("setGroup", {
        //   group: general,
        // });
        // store.commit("removeFromGroupList", {
        //   index: index.value,
        // });
      })
      .catch((error) => {
        alert(error);
      });
  };

  const AddGroupMember = async (newMember: Member) => {
    if (groupModalData.value.type === "create") {
      members.value.push(newMember);
      return;
    }
    const url = serverURL.value + "v1/channels/" + groupID.value + "/members";
    const headers = { Authorization: localStorage.getItem("auth") };
    const body = { id: newMember.id };
    const requestConfig = {
      method: "post",
      url: url,
      headers: headers,
      data: body,
    };

    axios(requestConfig)
      .then(() => {
        if (!groupModalData.value.group) return;

        members.value.push(newMember);
        const ids = getMemberIDs();
        const updatedGroup: LocalGroup = {
          ...groupModalData.value.group,
          members: ids,
          name: nameInput.value,
        };

        pinia.updateGroupInGroupList(index.value!, updatedGroup);
        // store.commit("updateGroupInGroupList", {
        //   index: index.value,
        //   group: updatedGroup,
        // });
      })
      .catch((error) => {
        alert(error);
      });
  };

  const RemoveGroupMember = async (memberIndex: number) => {
    if (groupModalData.value.type === "create") {
      members.value.splice(memberIndex, 1);
      return;
    }
    const id = members.value[memberIndex].id;
    const url = serverURL.value + "v1/channels/" + groupID.value + "/members";
    const sessionToken = localStorage.getItem("auth");
    const data = {
      id: id,
    };
    const headers = {
      Authorization: sessionToken,
    };
    axios
      .delete(url, {
        headers,
        data,
      })
      .then(() => {
        if (!groupModalData.value.group) return;

        members.value.splice(memberIndex, 1);
        const ids = getMemberIDs();
        const updatedGroup: LocalGroup = {
          ...groupModalData.value.group,
          members: ids,
          name: nameInput.value,
        };

        pinia.updateGroupInGroupList(index.value!, updatedGroup);
        // store.commit("updateGroupInGroupList", {
        //   index: index.value,
        //   group: updatedGroup,
        // });
      })
      .catch((error) => {
        alert(error);
      });
  };

  return {
    descriptionInput,
    groupModalData,
    groupID,
    groupList,
    index,
    isModalTypeUpdate,
    members,
    memberIDs,
    memberNames,
    nameInput,
    GetSpecificGroup,
    CreateGroup,
    GetGroups,
    UpdateGroupDetails,
    LeaveGroup,
    DeleteGroup,
    AddGroupMember,
    RemoveGroupMember,
  };
};
