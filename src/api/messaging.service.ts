import axios from "axios";

import { ref, watch } from "vue";
import {
  LocalGroup,
  LocalMessage,
  Member,
  MessageList,
  ServerGroup,
  ServerMessage,
} from "@/types";
import {
  FormatDate,
  getRequest,
  postRequest,
  serverToClientMessage,
  serverToClientUser,
} from "@/utils";
import usePiniaStore from "@/store/pinia";
import useGroupsStore from "@/store/groups";
import useMessagesStore from "@/store/messages";
import { storeToRefs } from "pinia";
import { createLocalGroupName, createServerGroupName } from "@/utils/groups";

const api_url = import.meta.env.VITE_CLEARTRACE_API;

export const Messages = () => {
  const pinia = usePiniaStore();
  const groupsStore = useGroupsStore();
  const messageStore = useMessagesStore();
  const { getActiveGroupID, groupList } = storeToRefs(groupsStore);
  const { user } = storeToRefs(pinia);
  const bodyInput = ref("");

  const GetMessages = async (id: string = getActiveGroupID.value) => {
    const url = api_url + "v1/channels/" + id;
    const sessionToken = localStorage.getItem("auth");

    const { data, error } = await getRequest<ServerMessage[]>(url, {
      headers: { Authorization: sessionToken },
    });

    if (error) {
      alert(error);
    }
    if (!data) return;
    // .toReverse() leaves the original array intact and returns a new array in reverse order
    // For more info see: https://www.youtube.com/watch?v=3CBD5JZJJKw
    // messages.toReverse();

    const receivedMessages: LocalMessage[] = data
      .slice()
      .reverse()
      .map((message: ServerMessage) => {
        return serverToClientMessage(message);
      });

    const messageList: MessageList = {
      channelID: receivedMessages[0].channelID,
      messages: receivedMessages,
      unreadMessages: [],
    };
    messageStore.addToMessageLists(messageList);
  };

  const GetAllMessages = async () => {
    messageStore.clearMessageLists();
    const promises: Promise<void>[] = [];

    groupList.value.forEach((group) => {
      promises.push(GetMessages(group.id));
    });
    await Promise.all(promises);
  };

  const SendMessage = async () => {
    if (bodyInput.value.length === 0) return;
    if (!user.value) {
      alert(
        "An unexpected error occurred.\nThe page will reload upon closing this message."
      );
      location.reload();
      return;
    }
    const url = api_url + "v1/channels/" + getActiveGroupID.value;
    const sessionToken = localStorage.getItem("auth");
    const date = new Date();
    const formattedDate = FormatDate(date);

    const localMessage: LocalMessage = {
      channelID: getActiveGroupID.value,
      body: bodyInput.value,
      createdAt: date,
      createdAtTime: formattedDate,
      creator: user.value,
    };
    // Setting the msg id locally to -1 (will self-correct on page refresh)
    messageStore.addToActiveMessageList(localMessage);

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
    GetMessages,
    GetAllMessages,
    SendMessage,
  };
};

export const Groups = () => {
  const pinia = usePiniaStore();
  const groupsStore = useGroupsStore();
  const messageStore = useMessagesStore();
  const {
    groupModalData,
    getGroupModalGroupID,
    getGroupListIndex,
    groupList,
    previousActiveGroup,
  } = storeToRefs(groupsStore);
  const { getUserFullName } = storeToRefs(pinia);
  const awaitingGroupDetails = ref(false);
  const descriptionInput = ref("");
  const isModalTypeUpdate = groupModalData.value.type === "update";
  const members = ref<Member[]>([]);
  const memberIDs = ref<number[]>([]);
  const memberNames = ref<string[]>([]);
  const nameInput = ref("");

  const getMemberIDs = () => {
    return members.value.map((member) => member.id);
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
      memberIDs.value = members.value.map((member) => member.id);
      memberNames.value = members.value.map((member) => member.name);
    },
    {
      deep: true,
    }
  );

  const GetSpecificGroup = async (groupName: string) => {
    const url = api_url + "v1/channels?startsWith=" + groupName;
    const sessionToken = localStorage.getItem("auth");

    const { data, error } = await getRequest<ServerGroup[]>(url, {
      headers: { Authorization: sessionToken },
    });
    if (error) {
      alert(`Error getting specific group: ${error}`);
    }
    return data;
  };

  const CreateGroup = async () => {
    if (members.value.length === 0) {
      alert("Error: Invalid New Group Input");
      return;
    }
    const url = api_url + "v1/channels";
    const sessionToken = localStorage.getItem("auth");

    const groupName = createServerGroupName(
      memberNames.value,
      getUserFullName.value!
    );
    const date = new Date();

    const groupObject = {
      name: groupName,
      description: "*Enter a description*",
      private: true,
      members: memberIDs.value,
      createdAt: date,
      editedAt: undefined,
    };

    const { data, error } = await postRequest<typeof groupObject, ServerGroup>(
      url,
      groupObject,
      {
        headers: { Authorization: sessionToken },
      }
    );

    if (error) {
      alert(error);
    }
    if (!data) return;

    const newGroup: LocalGroup = {
      ...data,
      index: groupList.value.length,
      creator: serverToClientUser(data.creator),
    };
    groupsStore.addToGroupList(newGroup);
  };

  const GetGroups = async () => {
    const url = api_url + "v1/channels";
    const sessionToken = localStorage.getItem("auth");

    const { data, error } = await getRequest<ServerGroup[]>(url, {
      headers: { Authorization: sessionToken },
    });

    if (error) {
      alert(error);
    }
    if (!data) return;

    groupsStore.clearGroupList();

    const receivedGroups: LocalGroup[] = data.map((group, i): LocalGroup => {
      const name = createLocalGroupName(group.name, getUserFullName.value!);

      // Query full users present new groups that are not in userData: user[]
      return {
        ...group,
        name,
        createdAt: new Date(group.createdAt),
        index: i,
        creator: serverToClientUser(group.creator),
      };
    });

    groupsStore.setGroupList(receivedGroups);
  };

  const UpdateGroupDetails = async () => {
    const url = api_url + "v1/channels/" + getGroupModalGroupID.value;
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
        updatedGroup.index = getGroupListIndex.value;

        groupsStore.updateGroupInGroupList(
          getGroupListIndex.value!,
          updatedGroup
        );
      })
      .catch((error) => {
        alert(error);
      });
  };

  const LeaveGroup = async () => {
    if (!confirm("Are you sure you want to leave this group?")) {
      return;
    }
    const currentUserId = pinia.getUserID;
    const url =
      api_url + "v1/channels/" + getGroupModalGroupID.value + "/members";
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

        // Go back to the general group when deleting the channel
        // const general = store.getters.getGroupByID(store.state.general.id);
        const previousGroup = groupsStore.getGroupByID(
          previousActiveGroup.value.id
        );

        groupsStore.setActiveGroup(previousGroup!);
        const messageList = messageStore.getMessageList(previousGroup?.id!);
        messageStore.setActiveMessageList(messageList!);
        groupsStore.removeFromGroupList(getGroupListIndex.value!);
      })
      .catch((error) => {
        alert(error);
      });
  };

  const DeleteGroup = async () => {
    if (!confirm("Are you sure you want to delete this group?")) {
      return;
    }
    const url = api_url + "v1/channels/" + getGroupModalGroupID.value;
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
        const previousGroup = groupsStore.getGroupByID(
          previousActiveGroup.value.id
        );

        groupsStore.setActiveGroup(previousGroup!);
        const messageList = messageStore.getMessageList(previousGroup?.id!);
        messageStore.setActiveMessageList(messageList!);
        groupsStore.removeFromGroupList(getGroupListIndex.value!);
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
    const url =
      api_url + "v1/channels/" + getGroupModalGroupID.value + "/members";
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

        groupsStore.updateGroupInGroupList(
          getGroupListIndex.value!,
          updatedGroup
        );
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
    const url =
      api_url + "v1/channels/" + getGroupModalGroupID.value + "/members";
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

        groupsStore.updateGroupInGroupList(
          getGroupListIndex.value!,
          updatedGroup
        );
      })
      .catch((error) => {
        alert(error);
      });
  };

  return {
    descriptionInput,
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
