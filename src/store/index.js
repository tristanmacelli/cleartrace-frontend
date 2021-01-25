import { createStore } from "vuex";

const store = createStore({
  state() {
    return {
      debug: true,
      ChannelID: "5fec04e96d55740010123439",
      ChannelName: "General",
      user: null,
      socket: null,
      athenticated: false,
      modalOpen: false
    };
  },
  mutations: {
    setChannel(state, payload) {
      if (state.debug) {
        console.log("setChannel triggered with: ", payload);
      }
      state.ChannelID = payload.channelID;
      state.ChannelName = payload.channelName;
    },
    async setUser(state) {
      if (state.debug) {
        console.log("setUser triggered");
      }
      let sessionToken = localStorage.getItem("auth");
      let url = "https://slack.api.tristanmacelli.com/v1/users/";
      let resp = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: sessionToken
        }
      });
      if (!resp.ok) {
        alert("Error: ", resp.status);
      }
      let user = await resp.json();
      state.user = user;
    },
    clearUser(state) {
      if (state.debug) {
        console.log("clearUser triggered");
      }
      state.user = null;
    },
    setSocket(state) {
      if (state.debug) {
        console.log("setSocket triggered");
      }
      // Open WebSocket connection
      // if (
      //   state.socket == null ||
      //   state.socket.readyState === WebSocket.CLOSED
      // ) {
      let sessionToken = localStorage.getItem("auth");
      state.socket = new WebSocket(
        "wss://slack.api.tristanmacelli.com/v1/ws?auth=" + sessionToken
      );
      state.socket.onopen = function() {
        if (state.debug) {
          console.log("Successfully connected to the echo WebSocket server!");
        }
      };
      state.socket.onclose = close => {
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
        if (state.debug) {
          console.log("error: ", error);
          console.log("Error originating from the echo websocket server...");
        }
      };
    },
    clearSocket(state) {
      if (state.debug) {
        console.log("clearSocket triggered");
      }
      // state.socket is defined && state.socket.readyState === WebSocket.OPEN
      // Close WebSocket connection
      state.socket.close();
      // Eventually this should be removed
      state.socket = null;
    },
    setAuthentication(state) {
      if (state.debug) {
        console.log("setAuthentication triggered");
      }
      state.athenticated = true;
    },
    clearAuthentication(state) {
      if (state.debug) {
        console.log("clearAuthentication triggered");
      }
      state.athenticated = false;
    },
    setModal(state) {
      if (state.debug) {
        console.log("setModal triggered");
      }
      state.modalOpen = true;
    },
    clearModal(state) {
      if (state.debug) {
        console.log("clearModal triggered");
      }
      state.modalOpen = false;
    }
  },
  getters: {
    getChannelID(state) {
      return state.channelID;
    },
    getChannelName(state) {
      return state.channelName;
    },
    getUserID(state) {
      return state.user.id;
    },
    getUserFirstname(state) {
      return state.user.firstname;
    },
    getSocket(state) {
      return state.socket;
    },
    getAuth(state) {
      return state.authenticated;
    }
  }
});

export default store;
