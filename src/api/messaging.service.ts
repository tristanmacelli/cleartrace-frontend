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
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
  serverToClientGroup,
  serverToClientMessage,
} from "@/utils";
import usePiniaStore from "@/store/pinia";
import useGroupsStore from "@/store/groups";
import useMessagesStore from "@/store/messages";
import { storeToRefs } from "pinia";
import { createLocalGroupName, createServerGroupName } from "@/utils/groups";
import { AxiosError } from "axios";

const api_url = import.meta.env.VITE_CLEARTRACE_API;

// TODO: Refactor functions, removing side effects caused after requests return
export const Messages = () => {
  const pinia = usePiniaStore();
  const groupsStore = useGroupsStore();
  const messageStore = useMessagesStore();
  const { getActiveGroupID, groupList } = storeToRefs(groupsStore);
  const { user } = storeToRefs(pinia);
  const bodyInput = ref<string>("");

  const GetMessages = async (id: string = getActiveGroupID.value) => {
    const url = api_url + "v1/channels/" + id;
    const sessionToken = localStorage.getItem("auth");

    const { data, error } = await getRequest<ServerMessage[]>(url, {
      headers: { Authorization: sessionToken },
    });

    if (error) {
      alert(error);
      return;
    }
    if (!data) return;
    // .toReverse() leaves the original array intact and returns a new array in reverse order
    // For more info see: https://www.youtube.com/watch?v=3CBD5JZJJKw
    // messages.toReverse();

    const receivedMessages: LocalMessage[] = data
      .reverse()
      .map((message: ServerMessage) => {
        return serverToClientMessage(message);
      });

    const messageList: MessageList = {
      channelID: id,
      messages: receivedMessages,
      unreadMessages: [],
    };
    messageStore.addToMessageLists(messageList);
    return messageList;
  };

  const GetAllMessages = async () => {
    messageStore.clearMessageLists();
    const messageListPromises: Promise<MessageList | undefined>[] = [];

    groupList.value.forEach((group) => {
      messageListPromises.push(GetMessages(group.id));
    });
    const messageLists = await Promise.all(messageListPromises);
    return messageLists;
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

    const localMessage: LocalMessage = {
      channelID: getActiveGroupID.value,
      body: bodyInput.value,
      createdAt: date,
      createdAtTime: FormatDate(date),
      creator: user.value,
    };
    // Setting the msg id locally to -1 (will self-correct on page refresh)
    messageStore.addToActiveMessageList(localMessage);

    const { data, error } = await postRequest<LocalMessage, ServerMessage>(
      url,
      localMessage,
      {
        headers: {
          Authorization: sessionToken,
        },
      }
    );
    bodyInput.value = "";

    if (error) {
      // (message not sent)
      // Provide remedial action options:
      // 1. Attempt to send again
      // 2. Delete message (pop message off of message list)
      alert(error);
      return;
    }
    if (!data) return;
    return serverToClientMessage(data);
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
  const awaitingGroupDetails = ref<boolean>(false);
  const descriptionInput = ref<string>("");
  const isModalTypeUpdate = groupModalData.value.type === "update";
  const members = ref<Member[]>([]);
  const memberIDs = ref<number[]>([]);
  const memberNames = ref<string[]>([]);
  const nameInput = ref<string>("");

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

  const setPreviousGroupToActive = () => {
    groupsStore.setActiveGroup(previousActiveGroup.value);
    const messageList = messageStore.getMessageList(
      previousActiveGroup.value.id!
    );
    messageStore.setActiveMessageList(messageList!);
  };

  const GetSpecificGroup = async (groupName: string) => {
    const url = api_url + "v1/channels?startsWith=" + groupName;
    const sessionToken = localStorage.getItem("auth");

    const { data, error } = await getRequest<ServerGroup[]>(url, {
      headers: { Authorization: sessionToken },
    });
    if (error) {
      alert(`Error getting specific group: ${error}`);
      return;
    }
    if (!data) return;
    const localGroups = data.map((group) => {
      return serverToClientGroup(group, -1);
    });
    // Groups in this list have an invalid index that needs to be modified before adding the group to the groupList
    return localGroups;
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

    const groupObject = {
      name: groupName,
      description: "*Enter a description*",
      private: true,
      members: memberIDs.value,
      createdAt: new Date(),
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
      return;
    }
    if (!data) return;

    const newGroup = serverToClientGroup(data, groupList.value.length);
    groupsStore.addToGroupList(newGroup);
    return newGroup;
  };

  const GetGroups = async () => {
    const url = api_url + "v1/channels";
    const sessionToken = localStorage.getItem("auth");

    const { data, error } = await getRequest<ServerGroup[]>(url, {
      headers: { Authorization: sessionToken },
    });

    if (error) {
      alert(error);
      return;
    }
    if (!data) return;

    groupsStore.clearGroupList();

    const receivedGroups: LocalGroup[] = data.map((group, i): LocalGroup => {
      const name = createLocalGroupName(group.name, getUserFullName.value!);
      // Query full users present new groups that are not in userData: user[]
      return serverToClientGroup({ ...group, name }, i);
    });

    groupsStore.setGroupList(receivedGroups);
    return receivedGroups;
  };

  const UpdateGroupDetails = async () => {
    const url = api_url + "v1/channels/" + getGroupModalGroupID.value;
    const sessionToken = localStorage.getItem("auth");
    const body = {
      name: nameInput.value,
      description: descriptionInput.value,
    };

    const { data, error } = await patchRequest<typeof body, ServerGroup>(
      url,
      body,
      {
        headers: {
          Authorization: sessionToken,
        },
      }
    );

    if (error) {
      alert(error);
      return;
    }
    if (!data) return;

    const updatedGroup = serverToClientGroup(data, getGroupListIndex.value!);
    groupsStore.updateGroupInGroupList(getGroupListIndex.value!, updatedGroup);
    return updatedGroup;
  };

  const LeaveGroup = async (): Promise<{
    index?: number | undefined;
    error?: Error | AxiosError<unknown, any> | undefined;
  }> => {
    if (!confirm("Are you sure you want to leave this group?")) {
      return {};
    }
    const url =
      api_url + "v1/channels/" + getGroupModalGroupID.value + "/members";
    const sessionToken = localStorage.getItem("auth");
    const currentUserId = pinia.getUserID;

    const { error } = await deleteRequest(url, {
      headers: { Authorization: sessionToken },
      data: { id: currentUserId },
    });

    if (error) {
      alert(error);
      return { error };
    }
    if (!groupModalData.value.group) return {};

    setPreviousGroupToActive();
    groupsStore.removeFromGroupList(getGroupListIndex.value!);
    return { index: getGroupListIndex.value! };
  };

  const DeleteGroup = async (): Promise<{
    index?: number | undefined;
    error?: Error | AxiosError<unknown, any> | undefined;
  }> => {
    if (!confirm("Are you sure you want to delete this group?")) {
      return {};
    }
    const url = api_url + "v1/channels/" + getGroupModalGroupID.value;
    const sessionToken = localStorage.getItem("auth");

    const { error } = await deleteRequest<undefined>(url, {
      headers: {
        Authorization: sessionToken,
      },
    });

    if (error) {
      alert(error);
      return { error };
    }

    setPreviousGroupToActive();
    groupsStore.removeFromGroupList(getGroupListIndex.value!);
    return { index: getGroupListIndex.value! };
  };

  const AddGroupMember = async (newMember: Member) => {
    // Disable duplicate members
    if (members.value.findIndex((member) => member.id === newMember.id) > -1) {
      return;
    }
    if (groupModalData.value.type === "create") {
      members.value.push(newMember);
      return;
    }
    const url =
      api_url + "v1/channels/" + getGroupModalGroupID.value + "/members";
    const sessionToken = localStorage.getItem("auth");
    const body = { id: newMember.id };

    const { error } = await postRequest(url, body, {
      headers: { Authorization: sessionToken },
    });

    if (error) {
      alert(error);
      return;
    }

    if (!groupModalData.value.group) return;

    members.value.push(newMember);
    const updatedGroup: LocalGroup = {
      ...groupModalData.value.group,
      members: memberIDs.value,
    };

    groupsStore.updateGroupInGroupList(getGroupListIndex.value!, updatedGroup);
    return updatedGroup;
  };

  const RemoveGroupMember = async (memberIndex: number) => {
    if (groupModalData.value.type === "create") {
      members.value.splice(memberIndex, 1);
      return;
    }
    const url =
      api_url + "v1/channels/" + getGroupModalGroupID.value + "/members";
    const sessionToken = localStorage.getItem("auth");
    const id = members.value[memberIndex].id;

    const { error } = await deleteRequest(url, {
      headers: { Authorization: sessionToken },
      data: { id },
    });

    if (error) {
      alert(error);
      return;
    }

    if (!groupModalData.value.group) return;

    members.value.splice(memberIndex, 1);
    const updatedGroup: LocalGroup = {
      ...groupModalData.value.group,
      members: memberIDs.value,
    };

    groupsStore.updateGroupInGroupList(getGroupListIndex.value!, updatedGroup);
    return updatedGroup;
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
