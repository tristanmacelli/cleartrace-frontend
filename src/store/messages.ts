import { defineStore } from "pinia";

import { LocalMessage, MessageList } from "../types";
import { ComputedRef, Ref, computed, ref } from "vue";

export interface State {
  activeMessageList: Ref<MessageList | undefined>;
  messageLists: Ref<MessageList[]>;
  getActiveMessageListId: ComputedRef<string | undefined>;
  getActiveMessageListLength: ComputedRef<number | undefined>;
  setActiveMessageList: (messageList: MessageList) => void;
  addToActiveMessageList: (message: LocalMessage) => void;
  addUnreadMessage: (message: LocalMessage) => void;
  getMessageList: (channelID: string) => MessageList | undefined;
  getLatestMessage: (channelID: string) => LocalMessage | undefined;
  addToMessageList: (messages: MessageList) => void;
  removeFromMessageList: (index: number) => void;
  setMessageLists: (lists: MessageList[]) => void;
  clearMessageLists: () => void;
}

const useMessagesStore = defineStore("messages", (): State => {
  const messageLists = ref<MessageList[]>([]);
  const activeMessageList = ref<MessageList>();

  const getActiveMessageListId = computed<string | undefined>(
    () => activeMessageList.value?.channelID
  );

  const getActiveMessageListLength = computed<number | undefined>(
    () => activeMessageList.value?.messages.length
  );

  const setActiveMessageList = (messageList: MessageList) => {
    activeMessageList.value = {
      ...messageList,
      unreadMessages: [],
    };

    // localStorage.setItem(
    //   "activeMessageList",
    //   JSON.stringify(activeMessageList.value)
    // );
  };

  const addToActiveMessageList = (message: LocalMessage) => {
    activeMessageList.value?.messages.push(message);
  };

  const addUnreadMessage = (message: LocalMessage) => {
    const messageList = getMessageList(message.channelID);

    messageList?.unreadMessages?.push(message);
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

  const addToMessageList = (messages: MessageList) => {
    messageLists.value.push(messages);
  };

  const removeFromMessageList = (index: number) => {
    messageLists.value.splice(index, 1);
  };

  const setMessageLists = (lists: MessageList[]) => {
    messageLists.value = lists;
  };

  const clearMessageLists = () => {
    messageLists.value = [];
  };

  // const updateMessageList = (index: number, messages: ) => {
  //   messageLists.value.splice(index, 1);
  //   messageLists.value.splice(index, 0, group);
  // };

  return {
    messageLists,
    activeMessageList,
    getActiveMessageListId,
    getActiveMessageListLength,
    setActiveMessageList,
    addToActiveMessageList,
    addUnreadMessage,
    getMessageList,
    getLatestMessage,
    addToMessageList,
    removeFromMessageList,
    setMessageLists,
    clearMessageLists,
  };
});

export default useMessagesStore;
