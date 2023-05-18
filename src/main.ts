import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import "./index.css";
// import usePiniaStore from "./store/pinia";

const pinia = createPinia();
const app = createApp(App);
// const piniaStore = usePiniaStore();

app.config.errorHandler = (err, vm) => {
  // eslint-disable-next-line
  console.log(err, vm);
  // if (piniaStore.debug) console.log(err, vm);
  // handle error
  // `info` is a Vue-specific error info, e.g. which lifecycle hook
  // the error was found in
};

app.config.warnHandler = (msg, vm, trace) => {
  // eslint-disable-next-line
  console.log(msg, vm, trace);
  // if (piniaStore.debug) console.log(msg, vm, trace);
  // `trace` is the component hierarchy trace
};

app.use(pinia);
app.use(router);
app.mount("#app");

// TODO: Determine whether the above app.use & app.mount statements are still needed.
