import { defineStore } from "pinia";
import { ComputedRef, Ref, computed, ref } from "vue";

import { LocalMessage, MessageList } from "../types";

export interface State {
  activeMessageList: Ref<MessageList | undefined>;
  previousActiveMessageList: Ref<MessageList | undefined>;
  messageLists: Ref<MessageList[]>;
  getActiveMessageListId: ComputedRef<string | undefined>;
  getActiveMessageListLength: ComputedRef<number | undefined>;
  setActiveMessageList: (messageList: MessageList) => void;
  setPreviousAsActiveMessageList: () => void;
  addToActiveMessageList: (message: LocalMessage) => void;
  addUnreadMessage: (message: LocalMessage) => void;
  updateMessageInMessageList: (
    messageList: MessageList,
    message: LocalMessage
  ) => void;
  removeMessageFromMessageList: (
    messageList: MessageList,
    index: string
  ) => void;
  getMessageList: (channelID: string) => MessageList | undefined;
  getLatestMessage: (channelID: string) => LocalMessage | undefined;
  addToMessageLists: (messages: MessageList) => void;
  removeFromMessageLists: (index: number) => void;
  setMessageLists: (lists: MessageList[]) => void;
  clearMessageLists: () => void;
}

const useMessagesStore = defineStore("messages", (): State => {
  const messageLists = ref<MessageList[]>([]);
  const activeMessageList = ref<MessageList>();
  const previousActiveMessageList = ref<MessageList>();

  const getActiveMessageListId = computed<string | undefined>(
    () => activeMessageList.value?.channelID
  );

  const getActiveMessageListLength = computed<number | undefined>(
    () => activeMessageList.value?.messages.length
  );

  const setActiveMessageList = (messageList: MessageList) => {
    previousActiveMessageList.value = activeMessageList.value;
    // In order to trigger an unreadMessages computed value, the messageList must be edited directly
    messageList.unreadMessages = [];
    activeMessageList.value = messageList;
  };

  const setPreviousAsActiveMessageList = () => {
    setActiveMessageList(previousActiveMessageList.value!);
  };

  const addToActiveMessageList = (message: LocalMessage) => {
    activeMessageList.value?.messages.push(message);
  };

  const addUnreadMessage = (message: LocalMessage) => {
    const messageList = getMessageList(message.channelID);

    messageList?.messages.push(message);
    messageList?.unreadMessages?.push(message);
  };

  // const getMessageByID = (
  //   messageList: MessageList,
  //   id: string
  // ): LocalMessage | undefined => {
  //   const index = messageList.messages.findIndex((msg) => msg.id === id);
  //   if (index > -1) {
  //     return messageList.messages[index];
  //   } else {
  //     // if (debug.value) console.log("Message not present");
  //     console.log("Message not present");
  //   }
  // };

  // TODO: verify the logic is sound
  // (This is carried over from the groupsStore)
  const updateMessageInMessageList = (
    messageList: MessageList,
    message: LocalMessage
  ) => {
    const index = messageList.messages.findIndex(
      (msg) => msg.id === message.id
    );
    if (index > -1) {
      messageList.messages[index] = message;
    }
  };

  const removeMessageFromMessageList = (
    messageList: MessageList,
    messageID: string
  ) => {
    const index = messageList.messages.findIndex((msg) => msg.id === messageID);
    if (index > -1) {
      messageList.messages.splice(index, 1);
    }
  };

  const getMessageList = (channelID: string): MessageList | undefined => {
    const index = messageLists.value.findIndex(
      (list) => list.channelID === channelID
    );

    if (index < 0) {
      return;
    }
    return messageLists.value[index];
  };

  const getLatestMessage = (channelID: string): LocalMessage | undefined => {
    const messageList = getMessageList(channelID);
    if (messageList) {
      const latestMessage = messageList.messages.at(-1);
      return latestMessage;
    }
  };

  const addToMessageLists = (messages: MessageList) => {
    messageLists.value.push(messages);
  };

  const removeFromMessageLists = (index: number) => {
    messageLists.value.splice(index, 1);
  };

  const setMessageLists = (lists: MessageList[]) => {
    messageLists.value = lists;
  };

  const clearMessageLists = () => {
    messageLists.value = [];
  };

  // const updateMessageList = (index: number, messageList: MessageList) => {
  //   messageLists.value[index] = messageList;
  // };

  return {
    messageLists,
    activeMessageList,
    previousActiveMessageList,
    getActiveMessageListId,
    getActiveMessageListLength,
    setActiveMessageList,
    setPreviousAsActiveMessageList,
    addToActiveMessageList,
    addUnreadMessage,
    updateMessageInMessageList,
    removeMessageFromMessageList,
    getMessageList,
    getLatestMessage,
    addToMessageLists,
    removeFromMessageLists,
    setMessageLists,
    clearMessageLists,
  };
});

export default useMessagesStore;
