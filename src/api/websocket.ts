import useGroupsStore from "@/store/groups";
import useMessagesStore from "@/store/messages";
import usePiniaStore from "@/store/pinia";
import {
  ChannelTransaction,
  MessageList,
  MessageTransaction,
  MessagingTransaction,
  ServerGroup,
  ServerMessage,
} from "@/types";
import {
  PlaySound,
  createLocalGroupName,
  serverToClientGroup,
  serverToClientMessage,
} from "@/utils";
import { storeToRefs } from "pinia";

const ws_url = import.meta.env.VITE_CLEARTRACE_WSS;

export const WebSocketService = () => {
  const pinia = usePiniaStore();
  const messageStore = useMessagesStore();
  const groupsStore = useGroupsStore();

  const { debug, socket, getUserFullName } = storeToRefs(pinia);
  const { getActiveGroupID, groupList } = storeToRefs(groupsStore);

  const SetSocket = async () => {
    if (debug.value) {
      // eslint-disable-next-line
      console.info("setSocket triggered");
    }
    const sessionToken = localStorage.getItem("auth");
    socket.value = new WebSocket(`${ws_url}v1/ws?auth=${sessionToken}`);

    socket.value.onopen = () => {
      if (debug.value) {
        // eslint-disable-next-line
        console.info("Successfully connected to the echo WebSocket server!");
      }
    };

    socket.value.onmessage = (event: MessageEvent<any>) => {
      if (debug.value) console.info("Message Received!");
      const receivedData: MessagingTransaction = JSON.parse(event.data);

      // User Message API
      if (receivedData.type.startsWith("message")) {
        const messageTransaction: MessageTransaction = receivedData;

        switch (messageTransaction.type) {
          case "message-new": {
            // TODO: Fix Non-null assertion
            newUserMessageHandler(messageTransaction.message!);
            break;
          }
          case "message-update": {
            // TODO: Fix Non-null assertion
            userMessageUpdatedHandler(messageTransaction.message!);
            break;
          }
          case "message-delete": {
            // TODO: Fix Non-null assertion
            userMessageDeletedHandler(
              messageTransaction.messageID!,
              messageTransaction.channelID!
            );
            break;
          }
        }
        return;
      }

      // Group API handlers
      const channelTransaction: ChannelTransaction = receivedData;

      switch (channelTransaction.type) {
        case "channel-new": {
          // TODO: Fix Non-null assertion
          groupCreatedHandler(channelTransaction.channel!);
          break;
        }
        case "channel-update": {
          // TODO: Fix Non-null assertion
          groupUpdatedHandler(channelTransaction.channel!);
          break;
        }
        case "channel-delete": {
          // TODO: Fix Non-null assertion
          groupDeletedHandler(channelTransaction.channelID!);
          break;
        }
      }
    };

    socket.value.onclose = (close) => {
      if (debug.value) {
        if (close.wasClean) {
          // eslint-disable-next-line
          console.info(
            "Successfully disconnected to the echo WebSocket server!"
          );
        } else {
          // eslint-disable-next-line
          console.error(
            "Not able to cleanly disconnected from the WebSocket server."
          );
        }
      }
    };

    socket.value.onerror = (error) => {
      if (debug.value) {
        // eslint-disable-next-line
        console.error("error: ", error);
        // eslint-disable-next-line
        console.error("Error originating from the echo websocket server...");
      }
    };
  };

  const ClearSocket = async () => {
    if (debug.value) {
      // eslint-disable-next-line
      console.info("clearSocket triggered");
    }
    if (!socket.value) return;
    // socket.value is defined && socket.value.readyState === WebSocket.OPEN
    // Close WebSocket connection with Normal Closure code (1000)
    const closeCode = 1000;
    socket.value.close(closeCode, "user terminated session");
    // conn.ReadMessage() returns the following from websockets.go
    // messageType: -1, msg: err: websocket: close 1000 (normal): user terminated session
    // Eventually this should be removed
    socket.value = undefined;
  };

  // https://stackoverflow.com/questions/10585355/sending-websocket-ping-pong-frame-from-browser
  // JS WS has no native ping. It's a matter of browser support. Can write your own ping but not recommended
  // due to the potential number of clients
  // const Ping = async () => {
  //   if (!socket.value) return;
  //   socket.value.send("");
  // };

  const newUserMessageHandler = (message: ServerMessage) => {
    // This is "default behavior", when messages are received on the active group
    const localMessage = serverToClientMessage(message);

    if (localMessage.channelID == getActiveGroupID.value) {
      messageStore.addToActiveMessageList(localMessage);
    } else {
      if (debug.value) console.info("Adding an unread message");
      messageStore.addUnreadMessage(localMessage);
    }
    groupsStore.setSortedGroupList();
    PlaySound();
  };

  const userMessageUpdatedHandler = (message: ServerMessage) => {
    const messageList = messageStore.getMessageList(message.channelID);
    const localMessage = serverToClientMessage(message);

    if (messageList) {
      // The local message can be used directly to the make
      messageStore.updateMessageInMessageList(messageList, localMessage);
    }
  };

  const userMessageDeletedHandler = (messageID: string, channelID: string) => {
    const messageList = messageStore.getMessageList(channelID);
    if (messageList) {
      messageStore.removeMessageFromMessageList(messageList, messageID);
    }
  };

  const groupCreatedHandler = (group: ServerGroup) => {
    // Create group & add it to the group list
    const name = createLocalGroupName(group.name, getUserFullName.value!);
    const newGroup = serverToClientGroup(
      { ...group, name },
      groupList.value.length
    );
    groupsStore.addToGroupList(newGroup);
    // Create message list for the group & add it to the store
    const messageList: MessageList = {
      channelID: group.id,
      messages: [],
      unreadMessages: [],
    };
    messageStore.addToMessageLists(messageList);
    // Update the group list to reflect the group creation
    groupsStore.setSortedGroupList();
  };

  const groupUpdatedHandler = (group: ServerGroup) => {
    const localGroup = groupsStore.getGroupByID(group.id);

    if (localGroup) {
      groupsStore.updateGroupInGroupList(localGroup.index, {
        ...localGroup,
        name: group.name,
        description: group.description,
        members: group.members,
        editedAt: group.editedAt,
      });
    }
  };

  const groupDeletedHandler = (groupID: string) => {
    const localGroup = groupsStore.getGroupByID(groupID);
    if (localGroup) {
      // Delete the group
      groupsStore.removeFromGroupList(localGroup.index);
      // Delete the associated messageList
      messageStore.removeFromMessageLists(localGroup.index);
      // Update the group list to reflect the group deletion
      groupsStore.setSortedGroupList();
    }
  };

  return {
    SetSocket,
    ClearSocket,
  };
};
