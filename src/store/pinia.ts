import { defineStore } from "pinia";
import { LocalUser } from "../types";
import { ComputedRef, Ref, computed, readonly, ref, watch } from "vue";

export interface State {
  // A switch for controlling navigation
  authenticated: Ref<boolean>;
  // Prevents reconnect attempts when the client manually closes the connection
  clientClosedSocket: Ref<boolean>;
  // Controls logging output for state actions, mutations, & getters
  debug: Readonly<Ref<boolean>>;
  groupMessageListLimit: Ref<number>;
  // A fallback in case backend request fails on its initial attempt
  isGroupListOpen: Ref<boolean>;
  isMobile: Ref<boolean>;
  awaitingComponentData: Ref<boolean>;
  socket: Ref<WebSocket | undefined>;
  socketReconnecting: Ref<boolean>;
  user: Ref<LocalUser | undefined>;
  userInitials: ComputedRef<string>;
  getUserID: ComputedRef<number | undefined>;
  getUserFullName: ComputedRef<string | undefined>;
  setAuthenticated: (value: boolean) => void;
  setIsGroupListOpen: (value: boolean) => void;
  setIsMobile: (value: boolean) => void;
  setSocket: (websocket: WebSocket) => void;
  setUser: (newUser: LocalUser) => void;
  clearSocket: () => void;
  clearUser: () => void;
}

const MESSAGE_LIST_CACHE_LIMIT = 20;

const usePiniaStore = defineStore("pinia", (): State => {
  const authenticated = ref<boolean>(false);
  const noUseDebug = ref<boolean>(!import.meta.env.PROD);
  const clientClosedSocket = ref<boolean>(false);
  const debug = readonly(noUseDebug);
  const groupMessageListLimit = ref<number>(MESSAGE_LIST_CACHE_LIMIT);
  const isGroupListOpen = ref<boolean>(true);
  const isMobile = ref<boolean>(false);
  const awaitingComponentData = ref<boolean>(false);
  const socket = ref<WebSocket | undefined>(undefined);
  const socketReconnecting = ref<boolean>(false);
  const user = ref<LocalUser | undefined>(undefined);

  // This ensures that the groupsList renders properly when the screen is resized
  watch(isMobile, (newValue) =>
    newValue ? null : (isGroupListOpen.value = true)
  );

  // Getters
  const userInitials = computed<string>(() => {
    return user.value
      ? user.value.firstName.charAt(0) + user.value.lastName.charAt(0)
      : "";
  });

  const getUserID = computed<number | undefined>(() => user.value?.id);

  const getUserFullName = computed<string | undefined>(
    () => `${user.value?.firstName} ${user.value?.lastName}`
  );

  // Mutations
  const setAuthenticated = (newValue: boolean) => {
    authenticated.value = newValue;
  };
  const setIsGroupListOpen = (newValue: boolean) => {
    isGroupListOpen.value = newValue;
  };
  const setIsMobile = (newValue: boolean) => {
    isMobile.value = newValue;
  };

  const setSocket = (websocket: WebSocket) => {
    socket.value = websocket;
  };

  const setUser = (newUser: LocalUser) => {
    user.value = newUser;
  };

  const clearSocket = () => {
    socket.value = undefined;
  };

  const clearUser = () => {
    user.value = undefined;
  };

  return {
    authenticated,
    clientClosedSocket,
    debug,
    groupMessageListLimit,
    isGroupListOpen,
    isMobile,
    awaitingComponentData,
    socket,
    socketReconnecting,
    user,
    userInitials,
    getUserID,
    getUserFullName,
    setAuthenticated,
    setIsGroupListOpen,
    setIsMobile,
    setSocket,
    setUser,
    clearSocket,
    clearUser,
  };
});

export default usePiniaStore;
