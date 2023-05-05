// app.js (shared between server and client)
import { createSSRApp } from "vue";
import store from "./store";
import App from "./App.vue";

export const createApp = () => {
  const app = createSSRApp(App);

  // provide store at the app level
  app.provide("store", store);
  // also expose store for hydration purposes
  return { app, store };
};
