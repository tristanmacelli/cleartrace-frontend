import { nextTick } from "vue";
import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";
import Account from "../views/Account.vue";
import Landing from "../views/Landing.vue";
import Terms from "../views/Terms.vue";
import NotFound from "../components/NotFound.vue";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Landing",
    component: Landing,
    meta: {
      title: "Cleartrace - Log In",
    },
  },
  {
    path: "/home",
    // path: "/home/:groupID",
    name: "Home",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import("../views/Home.vue") /* About.1kljhwe8.ts */,
  },
  {
    path: "/account",
    // path: "/account/:userID",
    name: "Account",
    component: Account,
  },
  {
    path: "/legal/terms",
    // path: "/account/:userID",
    name: "Terms",
    component: Terms,
  },
  // To serve for real not found paths (rather than manual reload paths)
  {
    path: "/:pathMatch(.*)*",
    name: "Not Found",
    component: NotFound,
  },
];

const router = createRouter({
  history: createWebHistory(), // Required for logic based on route change events
  routes: routes,
});

const DEFAULT_TITLE = "Cleartrace";

// After every route change vue updates the page title based on a value provided
// by the route object otherwise, if no value was provided, it uses DEFAULT_TITLE
router.afterEach((to) => {
  // Use next tick to handle router history correctly
  // see: https://github.com/vuejs/vue-router/issues/914#issuecomment-384477609
  nextTick(() => {
    document.title = (to.meta.title as string) || DEFAULT_TITLE;
  });
});

export default router;
export { routes };
