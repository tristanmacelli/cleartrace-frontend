import { createApp } from "vue";

import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import "./index.css";
import usePiniaStore from "./store/pinia";

const pinia = createPinia();
const app = createApp(App);

app.use(pinia);
app.use(router);
app.mount("#app");

// Cannot use pinia stores until pinia is registered with the application.
const piniaStore = usePiniaStore();

app.config.errorHandler = (err, vm) => {
  if (piniaStore.debug) console.log(err, vm);
  // handle error
  // `info` is a Vue-specific error info, e.g. which lifecycle hook
  // the error was found in
};

app.config.warnHandler = (msg, vm, trace) => {
  if (piniaStore.debug) console.log(msg, vm, trace);
  // `trace` is the component hierarchy trace
};

// TODO: Determine whether the above app.use & app.mount statements are still needed.
