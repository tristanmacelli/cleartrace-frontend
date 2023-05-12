import { createStore, createLogger } from "vuex";
import { LocalGroup, LocalUser } from "../types";
import { Users } from "../api/users";
import { serverToClientUser } from "@/utils";

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

const MESSAGE_LIST_CACHE_LIMIT = 20;

export interface State {
  // A switch for controlling navigation
  authenticated: boolean;
  // Controls logging output for state actions, mutations, & getters
  debug: boolean;
  activeGroup: LocalGroup;
  groupModalData: {
    group?: LocalGroup;
    type: string;
  };
  groupList: LocalGroup[];
  groupMessageListLimit: number;
  // A fallback in case backend request fails on its initial attempt
  general: LocalGroup;
  isGroupListOpen: boolean;
  isMobile: boolean;
  serverURL: string;
  socket?: WebSocket;
  user?: LocalUser;
  membersUserData: LocalUser[];
  window: {
    width: number;
    height: number;
  };
}

const state: State = {
  // A switch for controlling navigation
  authenticated: false,
  // Controls logging output for state actions, mutations, & getters
  debug: false,
  activeGroup: generalGroup,
  groupModalData: {
    group: undefined,
    type: "",
  },
  groupList: [],
  groupMessageListLimit: MESSAGE_LIST_CACHE_LIMIT,
  // A fallback in case backend request fails on its initial attempt
  general: generalGroup,
  isGroupListOpen: true,
  isMobile: false,
  serverURL: "https://slack.api.tristanmacelli.com/",
  socket: undefined,
  user: undefined,
  membersUserData: [],
  window: {
    width: 0,
    height: 0,
  },
};

const debug = process.env.NODE_ENV !== "production";
const plugins = debug ? [createLogger({})] : [];

const store = createStore({
  state,
  actions: {
    async setUser({ commit }) {
      const { GetUser } = Users();
      const response = await GetUser(state.serverURL);

      if (response.user) {
        const localUser = serverToClientUser(response.user);
        commit("setUser", localUser);
      }
    },
    async setSocket({ commit }) {
      commit("setSocket");
    },
  },
  mutations: {
    setGroup(state, payload) {
      if (state.debug) {
        // eslint-disable-next-line
        console.log("setGroup triggered with: ", payload);
      }
      state.activeGroup = payload.group;
    },
    setgroupModalData(state, payload) {
      if (state.debug) {
        // eslint-disable-next-line
        console.log("setGroup triggered with: ", payload);
      }
      state.groupModalData = payload.groupModalData;
    },
    setGroupList(state, payload) {
      state.groupList = payload.groupList;
    },
    addToGroupList(state, payload) {
      state.groupList.push(payload.group);
    },
    removeFromGroupList(state, payload) {
      state.groupList.splice(payload.index, 1);
    },
    updateGroupInGroupList(state, payload) {
      state.groupList.splice(payload.index, 1);
      state.groupList.splice(payload.index, 0, payload.group);
    },
    clearGroupList(state) {
      state.groupList = [];
    },
    setUser(state, payload) {
      if (state.debug) {
        // eslint-disable-next-line
        console.log("setUser triggered");
      }
      state.user = payload;
    },
    clearUser(state) {
      if (state.debug) {
        // eslint-disable-next-line
        console.log("clearUser triggered");
      }
      state.user = undefined;
    },
    setSocket(state) {
      if (state.debug) {
        // eslint-disable-next-line
        console.log("setSocket triggered");
      }
      const sessionToken = localStorage.getItem("auth");
      state.socket = new WebSocket(
        "wss://slack.api.tristanmacelli.com/v1/ws?auth=" + sessionToken
      );
      state.socket.onopen = () => {
        if (state.debug) {
          // eslint-disable-next-line
          console.log("Successfully connected to the echo WebSocket server!");
        }
      };
      state.socket.onclose = (close) => {
        if (state.debug) {
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
      state.socket.onerror = (error) => {
        if (state.debug) {
          // eslint-disable-next-line
          console.log("error: ", error);
          // eslint-disable-next-line
          console.log("Error originating from the echo websocket server...");
        }
      };
    },
    clearSocket(state) {
      if (state.debug) {
        // eslint-disable-next-line
        console.log("clearSocket triggered");
      }
      if (!state.socket) return;
      // state.socket is defined && state.socket.readyState === WebSocket.OPEN
      // Close WebSocket connection with Normal Closure code (1000)
      const closeCode = 1000;
      state.socket.close(closeCode);
      // Eventually this should be removed
      state.socket = undefined;
    },
    setAuthentication(state) {
      if (state.debug) {
        // eslint-disable-next-line
        console.log("setAuthentication triggered");
      }
      state.authenticated = true;
    },
    clearAuthentication(state) {
      if (state.debug) {
        // eslint-disable-next-line
        console.log("clearAuthentication triggered");
      }
      state.authenticated = false;
    },
    setWindowDimensions(state) {
      if (state.debug) {
        // eslint-disable-next-line
        console.log("setWindowDimensions triggered");
      }
      state.window.width = window.innerWidth;
      state.window.height = window.innerHeight;
    },
    clearWindowDimensions(state) {
      if (state.debug) {
        // eslint-disable-next-line
        console.log("clearWindowDimensions triggered");
      }
      state.window.width = 0;
      state.window.height = 0;
    },
    setIsGroupListOpen(state) {
      if (state.debug) {
        // eslint-disable-next-line
        console.log("setIsGroupListOpen triggered");
      }
      state.isGroupListOpen = true;
    },
    clearIsGroupListOpen(state) {
      if (state.debug) {
        // eslint-disable-next-line
        console.log("clearIsGroupListOpen triggered");
      }
      state.isGroupListOpen = false;
    },
    setIsMobile(state) {
      if (state.debug) {
        // eslint-disable-next-line
        console.log("setIsMobile triggered");
      }
      state.isMobile = true;
    },
    clearIsMobile(state) {
      if (state.debug) {
        // eslint-disable-next-line
        console.log("clearIsMobile triggered");
      }
      state.isMobile = false;
    },
  },
  getters: {
    getGroupByID: (state) => (id: string) => {
      // eslint-disable-next-line
      if (state.debug) console.log("getGroupByID triggered");

      const index = state.groupList.findIndex((group) => group.id === id);
      if (index > -1) {
        return state.groupList[index];
      } else {
        if (state.debug) console.log("Group not present");
      }
    },
    getActiveGroupID: (state) => {
      // eslint-disable-next-line
      if (state.debug) console.log("getActiveGroupID triggered");

      if (state.activeGroup) {
        return state.activeGroup.id;
      }
      return "";
    },
    getActiveGroupName: (state) => {
      // eslint-disable-next-line
      if (state.debug) console.log("getActiveGroupName triggered");

      if (state.activeGroup) {
        return state.activeGroup.name;
      }
      return "";
    },
    getGeneral: (state) => {
      // eslint-disable-next-line
      if (state.debug) console.log("getGeneral triggered");

      return state.general;
    },
    getServerURL: (state) => {
      // eslint-disable-next-line
      if (state.debug) console.log("getServerURL triggered");

      return state.serverURL;
    },
    getUser: (state) => {
      // eslint-disable-next-line
      if (state.debug) console.log("getUser triggered");

      return state.user;
    },
    getUserID: (state) => {
      // eslint-disable-next-line
      if (state.debug) console.log("getUserID triggered");

      if (state.user) {
        return state.user.id;
      }
      return "";
    },
    getUserFirstname: (state) => {
      // eslint-disable-next-line
      if (state.debug) console.log("getUserFirstname triggered");

      if (state.user) {
        return state.user.firstName;
      }
      return "";
    },
    getUserLastname: (state) => {
      // eslint-disable-next-line
      if (state.debug) console.log("getUserLastname triggered");

      if (state.user) {
        return state.user.lastName;
      }
      return "";
    },
    getUserInitials: (state) => {
      // eslint-disable-next-line
      if (state.debug) console.log("getUserInitials triggered");

      if (state.user) {
        return state.user.firstName.charAt(0) + state.user.lastName.charAt(0);
      }
      return "";
    },
    getSocket: (state) => {
      // eslint-disable-next-line
      if (state.debug) console.log("getSocket triggered");

      return state.socket;
    },
    getAuthentication: (state) => {
      // eslint-disable-next-line
      if (state.debug) console.log("getAuthentication triggered");

      return state.authenticated;
    },
    getIsGroupListOpen: (state) => {
      // eslint-disable-next-line
      if (state.debug) console.log("getIsGroupListOpen triggered");

      return state.isGroupListOpen;
    },
    getIsMobile: (state) => {
      // eslint-disable-next-line
      if (state.debug) console.log("getIsMobile triggered");

      return state.isMobile;
    },
  },
  strict: debug,
  plugins,
});

export default store;
