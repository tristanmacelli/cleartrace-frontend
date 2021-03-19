import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import "./index.css";

const app = createApp(App);

app.config.errorHandler = (err, vm) => {
  console.log(err, vm);
  // handle error
  // `info` is a Vue-specific error info, e.g. which lifecycle hook
  // the error was found in
};

app.config.warnHandler = function(msg, vm, trace) {
  console.log(msg, vm, trace);
  // `trace` is the component hierarchy trace
};

app.use(router);
app.use(store);
app.mount("#app");
