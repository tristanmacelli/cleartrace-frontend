import axios from "axios";
import { createStore, createLogger } from "vuex";

const debug = process.env.NODE_ENV !== "production";
const plugins = debug ? [createLogger({})] : [];
const store = createStore({
  state() {
    return {
      // A switch for controlling navigation
      authenticated: false,
      // Controls logging output for state actions, mutations, & getters
      debug: false,
      group: {
        id: "5fec04e96d55740010123439",
        name: "General"
      },
      // TODO: Rename to groupModalData
      groupModalData: {
        group: null,
        type: null
      },
      groupList: [],
      // A fallback in case backend request fails on its initial attempt
      general: {
        id: "5fec04e96d55740010123439",
        name: "General",
        description: "an open channel for all",
        members: [],
        creator: {
          id: -1
        }
      },
      isGroupListOpen: true,
      isMobile: false,
      serverURL: "https://slack.api.tristanmacelli.com/",
      socket: null,
      user: null,
      window: {
        width: 0,
        height: 0
      }
    };
  },
  actions: {
    async setUser(context) {
      context.commit("setUser");
    },
    async setSocket(context) {
      context.commit("setSocket");
    }
  },
  mutations: {
    setGeneral(state, payload) {
      // eslint-disable-next-line
      if (state.debug) {
        console.log("setGroup triggered with: ", payload);
      }
      state.general = payload.group;
    },
    setGroup(state, payload) {
      // eslint-disable-next-line
      if (state.debug) {
        console.log("setGroup triggered with: ", payload);
      }
      state.group = payload.group;
    },
    setgroupModalData(state, payload) {
      // eslint-disable-next-line
      if (state.debug) {
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
      // eslint-disable-next-line
      if (state.debug) {
        console.log("setUser triggered");
      }
      let sessionToken = localStorage.getItem("auth");
      let url = state.serverURL + "v1/users/";
      await axios
        .get(url, {
          headers: {
            Authorization: sessionToken
          }
        })
        .then(response => {
          state.user = response.data;
        })
        .catch(error => {
          // eslint-disable-next-line
          if (state.debug) {
            console.log(error);
          }
        });
    },
    clearUser(state) {
      // eslint-disable-next-line
      if (state.debug) {
        console.log("clearUser triggered");
      }
      state.user = null;
    },
    setSocket(state) {
      // eslint-disable-next-line
      if (state.debug) {
        console.log("setSocket triggered");
      }
      let sessionToken = localStorage.getItem("auth");
      state.socket = new WebSocket(
        "wss://slack.api.tristanmacelli.com/v1/ws?auth=" + sessionToken
      );
      state.socket.onopen = () => {
        // eslint-disable-next-line
        if (state.debug) {
          console.log("Successfully connected to the echo WebSocket server!");
        }
      };
      state.socket.onclose = close => {
        // eslint-disable-next-line
        if (state.debug) {
          console.log("close: ", close);
          if (close.wasClean) {
            console.log(
              "Successfully disconnected to the echo WebSocket server!"
            );
          } else {
            console.log(
              "Not able to cleanly disconnected from the WebSocket server."
            );
          }
        }
      };
      state.socket.onerror = error => {
        // eslint-disable-next-line
        if (state.debug) {
          console.log("error: ", error);
          console.log("Error originating from the echo websocket server...");
        }
      };
    },
    clearSocket(state) {
      // eslint-disable-next-line
      if (state.debug) {
        console.log("clearSocket triggered");
      }
      // state.socket is defined && state.socket.readyState === WebSocket.OPEN
      // Close WebSocket connection with Normal Closure code (1000)
      let closeCode = 1000;
      state.socket.close(closeCode);
      // Eventually this should be removed
      state.socket = null;
    },
    setAuthentication(state) {
      // eslint-disable-next-line
      if (state.debug) {
        console.log("setAuthentication triggered");
      }
      state.authenticated = true;
    },
    clearAuthentication(state) {
      // eslint-disable-next-line
      if (state.debug) {
        console.log("clearAuthentication triggered");
      }
      state.authenticated = false;
    },
    setWindowDimensions(state) {
      // eslint-disable-next-line
      if (state.debug) {
        console.log("setWindowDimensions triggered");
      }
      state.window.width = window.innerWidth;
      state.window.height = window.innerHeight;
    },
    clearWindowDimensions(state) {
      // eslint-disable-next-line
      if (state.debug) {
        console.log("clearWindowDimensions triggered");
      }
      state.window.width = 0;
      state.window.height = 0;
    },
    setIsGroupListOpen(state) {
      // eslint-disable-next-line
      if (state.debug) {
        console.log("setIsGroupListOpen triggered");
      }
      state.isGroupListOpen = true;
    },
    clearIsGroupListOpen(state) {
      // eslint-disable-next-line
      if (state.debug) {
        console.log("clearIsGroupListOpen triggered");
      }
      state.isGroupListOpen = false;
    },
    setIsMobile(state) {
      // eslint-disable-next-line
      if (state.debug) {
        console.log("setIsMobile triggered");
      }
      state.isMobile = true;
    },
    clearIsMobile(state) {
      // eslint-disable-next-line
      if (state.debug) {
        console.log("clearIsMobile triggered");
      }
      state.isMobile = false;
    }
  },
  getters: {
    getGroupID(state) {
      // eslint-disable-next-line
      if (state.debug) {
        console.log("getGroupID triggered");
      }
      if (state.group) {
        return state.group.id;
      }
      return "";
    },
    getGroupName(state) {
      // eslint-disable-next-line
      if (state.debug) {
        console.log("getGroupName triggered");
      }
      if (state.group) {
        return state.group.name;
      }
      return "";
    },
    getGeneral(state) {
      // eslint-disable-next-line
      if (state.debug) {
        console.log("getGeneral triggered");
      }
      return state.general;
    },
    getServerURL(state) {
      // eslint-disable-next-line
      if (state.debug) {
        console.log("getServerURL triggered");
      }
      return state.serverURL;
    },
    getUser(state) {
      // eslint-disable-next-line
      if (state.debug) {
        console.log("getUser triggered");
      }
      return state.user;
    },
    getUserID(state) {
      // eslint-disable-next-line
      if (state.debug) {
        console.log("getUserID triggered");
      }
      if (state.user) {
        return state.user.id;
      }
      return "";
    },
    getUserFirstname(state) {
      // eslint-disable-next-line
      if (state.debug) {
        console.log("getUserFirstname triggered");
      }
      if (state.user) {
        return state.user.FirstName;
      }
      return "";
    },
    getUserLastname(state) {
      // eslint-disable-next-line
      if (state.debug) {
        console.log("getUserLastname triggered");
      }
      if (state.user) {
        return state.user.LastName;
      }
      return "";
    },
    getUserInitials(state) {
      // eslint-disable-next-line
      if (state.debug) {
        console.log("getUserInitials triggered");
      }
      if (state.user) {
        return state.user.FirstName.charAt(0) + state.user.LastName.charAt(0);
      }
      return "";
    },
    getSocket(state) {
      // eslint-disable-next-line
      if (state.debug) {
        console.log("getSocket triggered");
      }
      return state.socket;
    },
    getAuthentication(state) {
      // eslint-disable-next-line
      if (state.debug) {
        console.log("getAuthentication triggered");
      }
      return state.authenticated;
    },
    getIsGroupListOpen(state) {
      // eslint-disable-next-line
      if (state.debug) {
        console.log("getIsGroupListOpen triggered");
      }
      return state.isGroupListOpen;
    },
    getIsMobile(state) {
      // eslint-disable-next-line
      if (state.debug) {
        console.log("getIsMobile triggered");
      }
      return state.isMobile;
    }
  },
  strict: debug,
  plugins
});

export default store;
