import { defineStore } from "pinia";
import { LocalUser } from "../types";
import { ComputedRef, Ref, computed, ref } from "vue";
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
  serverURL: Ref<string>;
  socket: Ref<WebSocket | undefined>;
  user: Ref<LocalUser | undefined>;
  window: Ref<{
    width: number;
    height: number;
  }>;
  userInitials: ComputedRef<string>;
  getUserID: ComputedRef<number | undefined>;
  setSocket: () => Promise<void>;
  clearSocket: () => Promise<void>;
  setUser: () => Promise<void>;
  setWindowDimensions: (width: number, height: number) => void;
}

const MESSAGE_LIST_CACHE_LIMIT = 20;

const usePiniaStore = defineStore("pinia", (): State => {
  const authenticated = ref<boolean>(false);
  const debug = ref<boolean>(false);
  const groupMessageListLimit = ref<number>(MESSAGE_LIST_CACHE_LIMIT);
  const isGroupListOpen = ref<boolean>(true);
  const isMobile = ref<boolean>(false);
  const serverURL = ref<string>("https://slack.api.tristanmacelli.com/");
  const socket = ref<WebSocket | undefined>(undefined);
  const user = ref<LocalUser | undefined>(undefined);
  const window = ref<{
    width: number;
    height: number;
  }>({
    width: 0,
    height: 0,
  });

  // Getters
  const userInitials = computed<string>(
    () => user.value!.firstName.charAt(0) + user.value!.lastName.charAt(0)
  );

  const getUserID = computed<number | undefined>(() => user.value?.id);

  // Mutations
  const setWindowDimensions = (width: number, height: number) => {
    if (debug.value) {
      // eslint-disable-next-line
      console.log("setWindowDimensions triggered");
    }
    window.value.width = width;
    window.value.height = height;
  };

  // Actions
  const setUser = async () => {
    const { GetUser } = Users();
    const response = await GetUser(serverURL.value);

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
    serverURL,
    socket,
    user,
    window,
    userInitials,
    getUserID,
    setSocket,
    clearSocket,
    setUser,
    setWindowDimensions,
  };
});

export default usePiniaStore;
