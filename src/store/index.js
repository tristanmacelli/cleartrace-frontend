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
    setUser(state, payload) {
      if (state.debug) {
        console.log("setUser triggered with: ", payload);
      }
      state.user = payload.user;
    },
    toggleSocket(state) {
      if (state.debug) {
        console.log("toggleSocket triggered");
      }
      // Open WebSocket connection
      if (
        state.socket == null ||
        state.socket.readyState === WebSocket.CLOSED
      ) {
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
        // state.socket is defined && state.socket.readyState === WebSocket.OPEN
      } else {
        // Close WebSocket connection
        state.socket.close();
        // Eventually this should be removed
        state.socket = null;
      }
    },
    toggleAuthentication(state) {
      if (state.debug) {
        console.log("toggleAuthentication triggered");
      }
      state.athenticated = !state.athenticated;
    },
    toggleModal(state) {
      if (state.debug) {
        console.log("toggleModal triggered");
      }
      state.modalOpen = !state.modalOpen;
    }
  },
  getters: {
    getChannelID(state) {
      return state.channelID;
    },
    getChannelName(state) {
      return state.channelName;
    },
    getUser(state) {
      return state.user;
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
