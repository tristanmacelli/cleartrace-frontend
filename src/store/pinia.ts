import { defineStore } from "pinia";
import { LocalGroup, LocalUser } from "../types";
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


const generalGroup: LocalGroup = {
  id: "5fec04e96d55740010123439",
  name: "General",
  description: "an open channel for all",
  creator: {
    id: -1,
    email: "",
    firstName: "",
    lastName: "",
    photoURL: "",
  },
  members: [],
  private: false,
  messageList: [],
  createdAt: new Date(),
  editedAt: new Date(),
  index: 0,
};

export interface State {
  // A switch for controlling navigation
  authenticated: Ref<boolean>;
  // Controls logging output for state actions, mutations, & getters
  debug: Ref<boolean>;
  activeGroup: Ref<LocalGroup>;
  groupModalData: Ref<{
    group?: LocalGroup;
    type: string;
  }>;
  groupList: Ref<LocalGroup[]>;
  groupMessageListLimit: Ref<number>;
  // A fallback in case backend request fails on its initial attempt
  general: Ref<LocalGroup>;
  isGroupListOpen: Ref<boolean>;
  isMobile: Ref<boolean>;
  serverURL: Ref<string>;
  socket: Ref<WebSocket | undefined>;
  user: Ref<LocalUser | undefined>;
  membersUserData: Ref<LocalUser[]>;
  window: Ref<{
    width: number;
    height: number;
  }>;
  userInitials: ComputedRef<string>;
  getGroupByID: (id: string) => LocalGroup | undefined;
  setSocket: () => void;
  clearSocket: () => void;
  setUser: () => void;
  addToGroupList: (group: LocalGroup) => void;
  removeFromGroupList: (index: number) => void;
  updateGroupInGroupList: (index: number, group: LocalGroup) => void;
  setWindowDimensions: (width: number, height: number) => void;
}

const MESSAGE_LIST_CACHE_LIMIT = 20;

export const useAlertsStore = defineStore("alerts", (): State => {
  const authenticated = ref<boolean>(false);
  const debug = ref<boolean>(false);
  const activeGroup = ref<LocalGroup>(generalGroup);
  const groupModalData = ref<{
    group?: LocalGroup;
    type: string;
  }>({
    group: undefined,
    type: "",
  });
  const groupList = ref<LocalGroup[]>([]);
  const groupMessageListLimit = ref<number>(MESSAGE_LIST_CACHE_LIMIT);
  const general = ref<LocalGroup>(generalGroup);
  const isGroupListOpen = ref<boolean>(true);
  const isMobile = ref<boolean>(false);
  const serverURL = ref<string>("https://slack.api.tristanmacelli.com/");
  const socket = ref<WebSocket | undefined>(undefined);
  const user = ref<LocalUser | undefined>(undefined);
  const membersUserData = ref<LocalUser[]>([]);
  const window = ref<{
    width: number;
    height: number;
  }>({
    width: 0,
    height: 0,
  });

  const userInitials = computed<string>(
    () => user.value!.firstName.charAt(0) + user.value!.lastName.charAt(0)
  );

  const getGroupByID = (id: string): LocalGroup | undefined => {
    const index = groupList.value.findIndex((group) => group.id === id);
    if (index > -1) {
      return groupList.value[index];
    } else {
      if (debug.value) console.log("Group not present");
    }
  };

  // Mutations
  const addToGroupList = (group: LocalGroup) => {
    groupList.value.push(group);
  };
  const removeFromGroupList = (index: number) => {
    groupList.value.splice(index, 1);
  };
  const updateGroupInGroupList = (index: number, group: LocalGroup) => {
    groupList.value.splice(index, 1);
    groupList.value.splice(index, 0, group);
  };

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

  const clearSocket = () => {
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
    activeGroup,
    groupModalData,
    groupList,
    groupMessageListLimit,
    general,
    isGroupListOpen,
    isMobile,
    serverURL,
    socket,
    user,
    membersUserData,
    window,
    userInitials,
    getGroupByID,
    setSocket,
    clearSocket,
    setUser,
    addToGroupList,
    removeFromGroupList,
    updateGroupInGroupList,
    setWindowDimensions,
  };
});
