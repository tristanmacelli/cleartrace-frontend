import { State } from "@/store";
import axios from "axios";

import { computed, ref, watch } from "vue";
import { useStore } from "vuex";
import {
  LocalGroup,
  LocalMessage,
  Member,
  ServerGroup,
  ServerMessage,
} from "..";
import { FormatDate, serverToClientMessage, serverToClientUser } from "@/utils";

export const Messages = () => {
  const store = useStore<State>();
  const bodyInput = ref("");
  const group = computed(() => store.state.activeGroup);
  const messageList = ref<LocalMessage[]>([]);
  const serverURL = computed(() => store.state.serverURL);
  const user = computed(() => store.state.user);

  const GetMessages = async () => {
    const url = serverURL.value + "v1/channels/" + group.value.id;
    const sessionToken = localStorage.getItem("auth");

    axios
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
    const url = serverURL.value + "v1/channels/" + group.value.id;
    const sessionToken = localStorage.getItem("auth");

    const date = new Date();
    const formattedDate = FormatDate(date);
    const localMessage: LocalMessage = {
      channelID: group.value.id,
      body: bodyInput.value,
      createdAt: formattedDate,
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
    body: bodyInput,
    group,
    messageList,
    GetMessages,
    SendMessage,
  };
};

export const Groups = () => {
  const store = useStore<State>();
  const awaitingGroupDetails = ref(false);
  const descriptionInput = ref("");
  const general = computed(() => store.state.general);
  const groupModalData = computed(() => store.state.groupModalData);
  const groupID = computed(() => store.state.groupModalData.group?.id);
  const groupList = computed(() => store.state.groupList);
  const index = computed(() => store.state.groupModalData.group?.index);
  const isModalTypeUpdate = groupModalData.value.type === "update";
  const members = ref<Member[]>([]);
  const memberIDs = ref<string[]>([]);
  const memberNames = ref<string[]>([]);
  const nameInput = ref("");
  const serverURL = computed(() => store.state.serverURL);

  const getMemberIDs = () => {
    const ids: string[] = [];
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
        if (store.state.debug) alert(`Error getting specific group: ${error}`);
      });
    return groups;
  };

  const GetGeneralGroup = async () => {
    const groups = await GetSpecificGroup("General");

    const generalGroup = groups[0];
    store.commit("setGroup", {
      group: generalGroup,
    });
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
        store.commit("addToGroupList", {
          group: newGroup,
        });
      })
      .catch((error) => {
        alert(error);
      });
  };

  const GetGroups = async () => {
    const url = serverURL.value + "v1/channels";
    const sessionToken = localStorage.getItem("auth");

    axios
      .get(url, {
        headers: {
          Authorization: sessionToken,
        },
      })
      .then((response) => {
        if (response == null) {
          return;
        }
        store.commit("clearGroupList");
        const receivedGroups: LocalGroup[] = [];
        response.data
          .slice()
          .reverse()
          .forEach((group: ServerGroup, i: number) => {
            // Query full users present new groups that are not in userData: user[]
            const localGroup: LocalGroup = {
              ...group,
              index: i,
              creator: serverToClientUser(group.creator),
            };
            receivedGroups.push(localGroup);
          });
        store.commit("setGroupList", {
          groupList: receivedGroups,
        });
      })
      .catch((error) => {
        alert(error);
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

        store.commit("updateGroupInGroupList", {
          index: index.value,
          group: updatedGroup,
        });
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
        store.commit("setGroup", {
          group: general.value,
        });
        store.commit("removeFromGroupList", {
          index: index.value,
        });
      })
      .catch((error) => {
        alert(error);
      });
  };

  const AddGroupMember = async (newMember: Member) => {
    if (groupModalData.value.type === "create") {
      const member = {
        id: newMember.id,
        // Was previously newMember.text
        name: newMember.name,
      };
      members.value.push(member);
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
        const member = {
          id: newMember.id,
          name: newMember.name,
        };
        if (!groupModalData.value.group) return;

        members.value.push(member);
        const ids = getMemberIDs();
        const updatedGroup = {
          creator: groupModalData.value.group.creator,
          description: descriptionInput.value,
          index: groupModalData.value.group.index,
          id: groupModalData.value.group.id,
          members: ids,
          name: nameInput.value,
        };

        store.commit("updateGroupInGroupList", {
          index: index.value,
          group: updatedGroup,
        });
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
        const updatedGroup = {
          creator: groupModalData.value.group.creator,
          description: descriptionInput.value,
          index: groupModalData.value.group.index,
          id: groupModalData.value.group.id,
          members: ids,
          name: nameInput.value,
        };

        store.commit("updateGroupInGroupList", {
          index: index.value,
          group: updatedGroup,
        });
      })
      .catch((error) => {
        alert(error);
      });
  };

  return {
    descriptionInput,
    general,
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
    GetGeneralGroup,
    CreateGroup,
    UpdateGroupDetails,
    GetGroups,
    DeleteGroup,
    AddGroupMember,
    RemoveGroupMember,
  };
};
