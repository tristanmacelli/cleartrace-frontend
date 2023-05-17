import { createApp } from "vue";
// import { createApp } from './app.js'
// Vue's server-rendering API is exposed under `vue/server-renderer`.
// import { renderToString } from 'vue/server-renderer'

import App from "./App.vue";
import router from "./router";
import store from "./store";
import { createPinia } from "pinia";
import "./index.css";

const pinia = createPinia();
const app = createApp(App);

app.config.errorHandler = (err, vm) => {
  // eslint-disable-next-line
  if (store.state.debug) console.log(err, vm);
  // handle error
  // `info` is a Vue-specific error info, e.g. which lifecycle hook
  // the error was found in
};

app.config.warnHandler = (msg, vm, trace) => {
  // eslint-disable-next-line
  if (store.state.debug) console.log(msg, vm, trace);
  // `trace` is the component hierarchy trace
};

app.use(pinia);
app.use(router);
app.use(store);
app.mount("#app");

// const app = createApp().mount("#app");

// TODO: Determine whether the above app.use & app.mount statements are still needed.
// renderToString(app);
