import { defineStore } from "pinia";
import { LocalUser } from "../types";
import { ComputedRef, Ref, computed, ref, watch } from "vue";
import { Users } from "@/api/users";

export interface State {
  // A switch for controlling navigation
  authenticated: Ref<boolean>;
  // Controls logging output for state actions, mutations, & getters
  debug: Ref<boolean>;
  groupMessageListLimit: Ref<number>;
  // A fallback in case backend request fails on its initial attempt
  isGroupListOpen: Ref<boolean>;
  isMobile: Ref<boolean>;
  socket: Ref<WebSocket | undefined>;
  user: Ref<LocalUser | undefined>;
  screen: Ref<{
    width: number;
    height: number;
  }>;
  userInitials: ComputedRef<string>;
  getUserID: ComputedRef<number | undefined>;
  getUserFullName: ComputedRef<string | undefined>;
  setAuthenticated: (value: boolean) => void;
  setIsGroupListOpen: (value: boolean) => void;
  setIsMobile: (value: boolean) => void;
  setUser: (newUser?: LocalUser) => Promise<void>;
}

const MESSAGE_LIST_CACHE_LIMIT = 20;

const usePiniaStore = defineStore("pinia", (): State => {
  const authenticated = ref<boolean>(false);
  const debug = ref<boolean>(!import.meta.env.PROD);
  const groupMessageListLimit = ref<number>(MESSAGE_LIST_CACHE_LIMIT);
  const isGroupListOpen = ref<boolean>(true);
  const isMobile = ref<boolean>(false);
  const screen = ref<{
    width: number;
    height: number;
  }>({
    width: 0,
    height: 0,
  });
  const socket = ref<WebSocket | undefined>(undefined);
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

  // Actions
  const setUser = async (newUser?: LocalUser) => {
    if (newUser) {
      user.value = newUser;
      return;
    }
    const { GetUserById } = Users();
    const response = await GetUserById();

    if (response.user) {
      user.value = response.user;
    }
  };

  return {
    authenticated,
    debug,
    groupMessageListLimit,
    isGroupListOpen,
    isMobile,
    socket,
    user,
    screen,
    userInitials,
    getUserID,
    getUserFullName,
    setAuthenticated,
    setIsGroupListOpen,
    setIsMobile,
    setUser,
  };
});

export default usePiniaStore;
