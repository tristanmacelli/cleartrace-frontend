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
  const { debug, user } = storeToRefs(pinia);

  const GetMessages = async (
    id: string = getActiveGroupID.value
  ): Promise<{
    messageList?: MessageList | undefined;
    error?: Error | AxiosError<unknown, any> | undefined;
  }> => {
    const url = api_url + "v1/channels/" + id;
    const sessionToken = localStorage.getItem("auth");

    const { data, error } = await getRequest<ServerMessage[]>(url, {
      headers: { Authorization: sessionToken },
    });

    if (error) {
      if (debug.value) console.error(error);
      return { error };
    }
    if (!data) return {};
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
    return { messageList };
  };

  const GetAllMessages = async () => {
    messageStore.clearMessageLists();
    const messageListPromises: Promise<{
      messageList?: MessageList | undefined;
      error?: Error | AxiosError<unknown, any> | undefined;
    }>[] = [];

    groupList.value.forEach((group) => {
      messageListPromises.push(GetMessages(group.id));
    });
    const messageLists = await Promise.all(messageListPromises);
    return messageLists;
  };

  const SendMessage = async (
    messageBody: string
  ): Promise<{
    newMessage?: LocalMessage | undefined;
    error?: Error | AxiosError<unknown, any> | undefined;
  }> => {
    if (messageBody.length === 0) return {};
    if (!user.value) {
      if (debug.value) {
        console.error(
          "An unexpected error occurred.\nThe page will reload upon closing this message."
        );
      }
      location.reload();
      return {};
    }
    const url = api_url + "v1/channels/" + getActiveGroupID.value;
    const sessionToken = localStorage.getItem("auth");
    const date = new Date();

    const localMessage: LocalMessage = {
      channelID: getActiveGroupID.value,
      body: messageBody,
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

    if (error) {
      // (message not sent)
      // Provide remedial action options:
      // 1. Attempt to send again
      // 2. Delete message (pop message off of message list)
      if (debug.value) console.error(error);
      return { error };
    }
    if (!data) return {};
    const newMessage = serverToClientMessage(data);
    return { newMessage };
  };

  return {
    GetMessages,
    GetAllMessages,
    SendMessage,
  };
};

export const Groups = () => {
  const pinia = usePiniaStore();
  const groupsStore = useGroupsStore();
  const { groupList } = storeToRefs(groupsStore);
  const { debug, getUserFullName } = storeToRefs(pinia);

  const GetSpecificGroup = async (
    groupName: string
  ): Promise<{
    groups?: LocalGroup[] | undefined;
    error?: Error | AxiosError<unknown, any> | undefined;
  }> => {
    const url = api_url + "v1/channels?startsWith=" + groupName;
    const sessionToken = localStorage.getItem("auth");

    const { data, error } = await getRequest<ServerGroup[]>(url, {
      headers: { Authorization: sessionToken },
    });
    if (error) {
      console.error(error);
      return { error };
    }
    if (!data)
      return {
        error: new Error(`no groups found with a name similar to ${groupName}`),
      };
    const localGroups = data.map((group) => {
      return serverToClientGroup(group, -1);
    });
    // Groups in this list have an invalid index that needs to be modified before adding the group to the groupList
    return { groups: localGroups };
  };

  const CreateGroup = async (
    members: Member[]
  ): Promise<{
    newGroup?: LocalGroup | undefined;
    error?: Error | AxiosError<unknown, any> | undefined;
  }> => {
    if (members.length === 0) {
      console.error("Invalid New Group Input");
      return { error: new Error("Invalid New Group Input") };
    }
    const url = api_url + "v1/channels";
    const sessionToken = localStorage.getItem("auth");
    const memberNames = members.map((m) => m.name);
    const memberIDs = members.map((m) => m.id);

    // TODO: Fix Non-null assertion
    const groupName = createServerGroupName(
      memberNames,
      getUserFullName.value!
    );

    const groupObject = {
      name: groupName,
      description: "*Enter a description*",
      private: true,
      members: memberIDs,
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
      console.error(error);
      return { error };
    }
    if (!data) return {};

    const newGroup = serverToClientGroup(data, groupList.value.length);
    return { newGroup };
  };

  const GetGroups = async (): Promise<{
    groups?: LocalGroup[] | undefined;
    error?: Error | AxiosError<unknown, any> | undefined;
  }> => {
    const url = api_url + "v1/channels";
    const sessionToken = localStorage.getItem("auth");

    const { data, error } = await getRequest<ServerGroup[]>(url, {
      headers: { Authorization: sessionToken },
    });

    if (error) {
      if (debug.value) console.error(error);
      return { error };
    }
    if (!data) return {};

    groupsStore.clearGroupList();

    const groups: LocalGroup[] = data.map((group, i): LocalGroup => {
      // TODO: Fix Non-null assertion
      const name = createLocalGroupName(group.name, getUserFullName.value!);
      // Query full users present new groups that are not in userData: user[]
      return serverToClientGroup({ ...group, name }, i);
    });

    groupsStore.setGroupList(groups);
    return { groups };
  };

  const UpdateGroupDetails = async (
    group: LocalGroup,
    name: string,
    description: string
  ): Promise<{
    updatedGroup?: LocalGroup | undefined;
    error?: Error | AxiosError<unknown, any> | undefined;
  }> => {
    const url = api_url + "v1/channels/" + group.id;
    const sessionToken = localStorage.getItem("auth");
    const body = {
      name,
      description,
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
      if (debug.value) console.error(error);
      return { error };
    }
    if (!data) return {};

    const updatedGroup = serverToClientGroup(data, group.index);
    groupsStore.updateGroupInGroupList(group.index, updatedGroup);
    return { updatedGroup };
  };

  const LeaveGroup = async (
    groupID: string,
    index: number
  ): Promise<{
    index?: number | undefined;
    error?: Error | AxiosError<unknown, any> | undefined;
  }> => {
    if (!confirm("Are you sure you want to leave this group?")) {
      return {};
    }
    const url = api_url + "v1/channels/" + groupID + "/members";
    const sessionToken = localStorage.getItem("auth");
    const currentUserId = pinia.getUserID;

    const { error } = await deleteRequest(url, {
      headers: { Authorization: sessionToken },
      data: { id: currentUserId },
    });

    if (error) {
      if (debug.value) console.error(error);
      return { error };
    }

    return { index };
  };

  const DeleteGroup = async (
    groupID: string,
    index: number
  ): Promise<{
    index?: number | undefined;
    error?: Error | AxiosError<unknown, any> | undefined;
  }> => {
    if (!confirm("Are you sure you want to delete this group?")) {
      return {};
    }
    const url = api_url + "v1/channels/" + groupID;
    const sessionToken = localStorage.getItem("auth");

    const { error } = await deleteRequest<undefined>(url, {
      headers: {
        Authorization: sessionToken,
      },
    });

    if (error) {
      if (debug.value) console.error(error);
      return { error };
    }

    return { index };
  };

  const AddGroupMember = async (
    group: LocalGroup,
    members: Member[],
    newMember: Member
  ): Promise<{
    updatedGroup?: LocalGroup | undefined;
    error?: Error | AxiosError<unknown, any> | undefined;
  }> => {
    // Disable duplicate members
    if (members.findIndex((member) => member.id === newMember.id) > -1) {
      return { error: new Error("duplicate member") };
    }

    const url = api_url + "v1/channels/" + group.id + "/members";
    const sessionToken = localStorage.getItem("auth");
    const body = { id: newMember.id };

    const { data, error } = await postRequest<typeof body, ServerGroup>(
      url,
      body,
      {
        headers: { Authorization: sessionToken },
      }
    );

    if (error) {
      if (debug.value) console.error(error);
      return { error };
    }

    if (!data) {
      return { error: new Error("") };
    }

    const updatedGroup = serverToClientGroup(data, group.index);
    return { updatedGroup };
  };

  const RemoveGroupMember = async (
    group: LocalGroup,
    members: Member[],
    memberIndex: number
  ): Promise<{
    updatedGroup?: LocalGroup | undefined;
    error?: Error | AxiosError<unknown, any> | undefined;
  }> => {
    const url = api_url + "v1/channels/" + group.id + "/members";
    const sessionToken = localStorage.getItem("auth");
    const membersCopy = members.slice();
    const id = membersCopy[memberIndex].id;

    const { error } = await deleteRequest(url, {
      headers: { Authorization: sessionToken },
      data: { id },
    });

    if (error) {
      if (debug.value) console.error(error);
      return { error };
    }

    membersCopy.splice(memberIndex, 1);
    const memberIDs = membersCopy.map((m) => m.id);
    const updatedGroup: LocalGroup = {
      ...group,
      members: memberIDs,
    };

    return { updatedGroup };
  };

  return {
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
