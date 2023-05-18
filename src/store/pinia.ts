import { defineStore } from "pinia";
import { LocalUser } from "../types";
import { ComputedRef, Ref, computed, ref, watch } from "vue";
import { Users } from "@/api/users";
import { serverToClientUser } from "@/utils";

// import { createStore, createLogger } from "vuex";

// const debug = process.env.NODE_ENV !== "production";
// const plugins = debug ? [createLogger({})] : [];

// const store = createStore({
//   state: {
//     placeholder: "",
//   },
//   strict: debug,
//   plugins,
// });

// export default store;

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
  setAuthenticated: (value: boolean) => void;
  setIsGroupListOpen: (value: boolean) => void;
  setIsMobile: (value: boolean) => void;
  setScreenDimensions: (width: number, height: number) => void;
  setSocket: () => Promise<void>;
  clearSocket: () => Promise<void>;
  setUser: () => Promise<void>;
}

const MESSAGE_LIST_CACHE_LIMIT = 20;

const usePiniaStore = defineStore("pinia", (): State => {
  const authenticated = ref<boolean>(false);
  const debug = ref<boolean>(process.env.NODE_ENV !== "production");
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
  const userInitials = computed<string>(
    () => user.value!.firstName.charAt(0) + user.value!.lastName.charAt(0)
  );

  const getUserID = computed<number | undefined>(() => user.value?.id);

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

  const setScreenDimensions = (width: number, height: number) => {
    if (debug.value) {
      // eslint-disable-next-line
      console.log("setScreenDimensions triggered");
    }
    screen.value.width = width;
    screen.value.height = height;
  };

  // Actions
  const setUser = async () => {
    const { GetUser } = Users();
    const response = await GetUser();

    if (response.user) {
      const localUser = serverToClientUser(response.user);
      user.value = localUser;
    }
  };

  const setSocket = async () => {
    if (debug.value) {
      // eslint-disable-next-line
      console.log("setSocket triggered");
    }
    const sessionToken = localStorage.getItem("auth");
    socket.value = new WebSocket(
      "wss://slack.api.tristanmacelli.com/v1/ws?auth=" + sessionToken
    );
    socket.value.onopen = () => {
      if (debug.value) {
        // eslint-disable-next-line
        console.log("Successfully connected to the echo WebSocket server!");
      }
    };
    socket.value.onclose = (close) => {
      if (debug.value) {
        // eslint-disable-next-line
        console.log("close: ", close);
        if (close.wasClean) {
          // eslint-disable-next-line
          console.log(
            "Successfully disconnected to the echo WebSocket server!"
          );
        } else {
          // eslint-disable-next-line
          console.log(
            "Not able to cleanly disconnected from the WebSocket server."
          );
        }
      }
    };
    socket.value.onerror = (error) => {
      if (debug.value) {
        // eslint-disable-next-line
        console.log("error: ", error);
        // eslint-disable-next-line
        console.log("Error originating from the echo websocket server...");
      }
    };
  };

  const clearSocket = async () => {
    if (debug.value) {
      // eslint-disable-next-line
      console.log("clearSocket triggered");
    }
    if (!socket.value) return;
    // socket.value is defined && socket.value.readyState === WebSocket.OPEN
    // Close WebSocket connection with Normal Closure code (1000)
    const closeCode = 1000;
    socket.value.close(closeCode);
    // Eventually this should be removed
    socket.value = undefined;
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
    setAuthenticated,
    setIsGroupListOpen,
    setIsMobile,
    setScreenDimensions,
    setUser,
    setSocket,
    clearSocket,
  };
});

export default usePiniaStore;
