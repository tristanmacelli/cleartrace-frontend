import usePiniaStore from "@/store/pinia";

const ws_url = import.meta.env.VITE_CLEARTRACE_WSS;

export const WebSocketService = () => {
  const pinia = usePiniaStore();

  const setSocket = async () => {
    if (pinia.debug) {
      // eslint-disable-next-line
          console.log("setSocket triggered");
    }
    const sessionToken = localStorage.getItem("auth");
    pinia.socket = new WebSocket(`${ws_url}v1/ws?auth=${sessionToken}`);

    pinia.socket.onopen = () => {
      if (pinia.debug) {
        // eslint-disable-next-line
            console.log("Successfully connected to the echo WebSocket server!");
      }
    };
    pinia.socket.onclose = (close) => {
      if (pinia.debug) {
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
    pinia.socket.onerror = (error) => {
      if (pinia.debug) {
        // eslint-disable-next-line
            console.log("error: ", error);
        // eslint-disable-next-line
            console.log("Error originating from the echo websocket server...");
      }
    };
  };

  const clearSocket = async () => {
    if (pinia.debug) {
      // eslint-disable-next-line
          console.log("clearSocket triggered");
    }
    if (!pinia.socket) return;
    // pinia.socket is defined && pinia.socket.readyState === WebSocket.OPEN
    // Close WebSocket connection with Normal Closure code (1000)
    const closeCode = 1000;
    pinia.socket.close(closeCode);
    // Eventually this should be removed
    pinia.socket = undefined;
  };

  return {
    setSocket,
    clearSocket,
  };
};
