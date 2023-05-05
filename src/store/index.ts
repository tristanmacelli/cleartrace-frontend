import axios from "axios";
import { createStore, createLogger } from "vuex";

const generalGroup: Group = {
  createdAt: undefined,
  editedAt: undefined,
  creator: {
    id: -1,
  },
  description: "an open channel for all",
  id: "5fec04e96d55740010123439",
  members: [],
  name: "General",
  private: false,
};

export interface State {
  // A switch for controlling navigation
  authenticated: boolean;
  // Controls logging output for state actions, mutations, & getters
  debug: boolean;
  group: Group;
  groupModalData: {
    group?: LocalGroup;
    type: string;
  };
  groupList: Group[];
  // A fallback in case backend request fails on its initial attempt
  general: Group;
  isGroupListOpen: boolean;
  isMobile: boolean;
  serverURL: string;
  socket?: WebSocket;
  user?: LocalUser;
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
  group: generalGroup,
  groupModalData: {
    group: undefined,
    type: "",
  },
  groupList: [],
  // A fallback in case backend request fails on its initial attempt
  general: generalGroup,
  isGroupListOpen: true,
  isMobile: false,
  serverURL: "https://slack.api.tristanmacelli.com/",
  socket: undefined,
  user: undefined,
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
    async setUser(context) {
      context.commit("setUser");
    },
    async setSocket(context) {
      context.commit("setSocket");
    },
  },
  mutations: {
    setGroup(state, payload) {
      if (state.debug) {
        // eslint-disable-next-line
        console.log("setGroup triggered with: ", payload);
      }
      state.group = payload.group;
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
    async setUser(state) {
      if (state.debug) {
        // eslint-disable-next-line
        console.log("setUser triggered");
      }
      const sessionToken = localStorage.getItem("auth");
      const url = state.serverURL + "v1/users/";
      await axios
        .get(url, {
          headers: {
            Authorization: sessionToken,
          },
        })
        .then((response) => {
          state.user = response.data;
        })
        .catch((error) => {
          if (state.debug) {
            // eslint-disable-next-line
            console.log(error);
          }
        });
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
    getGroupID(state) {
      if (state.debug) {
        // eslint-disable-next-line
        console.log("getGroupID triggered");
      }
      if (state.group) {
        return state.group.id;
      }
      return "";
    },
    getGroupName(state) {
      if (state.debug) {
        // eslint-disable-next-line
        console.log("getGroupName triggered");
      }
      if (state.group) {
        return state.group.name;
      }
      return "";
    },
    getGeneral(state) {
      if (state.debug) {
        // eslint-disable-next-line
        console.log("getGeneral triggered");
      }
      return state.general;
    },
    getServerURL(state) {
      if (state.debug) {
        // eslint-disable-next-line
        console.log("getServerURL triggered");
      }
      return state.serverURL;
    },
    getUser(state) {
      if (state.debug) {
        // eslint-disable-next-line
        console.log("getUser triggered");
      }
      return state.user;
    },
    getUserID(state) {
      if (state.debug) {
        // eslint-disable-next-line
        console.log("getUserID triggered");
      }
      if (state.user) {
        return state.user.id;
      }
      return "";
    },
    getUserFirstname(state) {
      if (state.debug) {
        // eslint-disable-next-line
        console.log("getUserFirstname triggered");
      }
      if (state.user) {
        return state.user.FirstName;
      }
      return "";
    },
    getUserLastname(state) {
      if (state.debug) {
        // eslint-disable-next-line
        console.log("getUserLastname triggered");
      }
      if (state.user) {
        return state.user.LastName;
      }
      return "";
    },
    getUserInitials(state) {
      if (state.debug) {
        // eslint-disable-next-line
        console.log("getUserInitials triggered");
      }
      if (state.user) {
        return state.user.FirstName.charAt(0) + state.user.LastName.charAt(0);
      }
      return "";
    },
    getSocket(state) {
      if (state.debug) {
        // eslint-disable-next-line
        console.log("getSocket triggered");
      }
      return state.socket;
    },
    getAuthentication(state) {
      if (state.debug) {
        // eslint-disable-next-line
        console.log("getAuthentication triggered");
      }
      return state.authenticated;
    },
    getIsGroupListOpen(state) {
      if (state.debug) {
        // eslint-disable-next-line
        console.log("getIsGroupListOpen triggered");
      }
      return state.isGroupListOpen;
    },
    getIsMobile(state) {
      if (state.debug) {
        // eslint-disable-next-line
        console.log("getIsMobile triggered");
      }
      return state.isMobile;
    },
  },
  strict: debug,
  plugins,
});

export default store;
