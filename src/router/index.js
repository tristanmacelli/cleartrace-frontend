import Vue from "vue";
import { createRouter, createWebHistory } from "vue-router";
import VueRouter from "vue-router";
import Landing from "../views/Landing.vue";
import Account from "../views/Account.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Log In",
    component: Landing,
    meta: {
      title: "Slack Clone - Log In"
    }
  },
  {
    path: "/home",
    name: "Home",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ "../views/Home.vue")
  },
  {
    path: "/account",
    name: "Account",
    component: Account
  }
  // To serve for real not found paths (rather than manual reload paths)
  // { path: '*', component: NotFoundComponent }
];

const router = createRouter({
  history: createWebHistory(), // Required for logic based on route change events
  routes: routes
});

// const router = new VueRouter({
//   routes,
//   mode: "history" // Required for logic based on route change events
// });

const DEFAULT_TITLE = "Slack Clone";

// After every route change vue updates the page title based on a value provided
// by the route object otherwise, if no value was provided, it uses DEFAULT_TITLE
router.afterEach(to => {
  // Use next tick to handle router history correctly
  // see: https://github.com/vuejs/vue-router/issues/914#issuecomment-384477609
  Vue.nextTick(() => {
    document.title = to.meta.title || DEFAULT_TITLE;
  });
});

export default router;
