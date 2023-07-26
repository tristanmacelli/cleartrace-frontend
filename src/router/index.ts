import { nextTick } from "vue";
import { RouteRecordRaw, createRouter, createWebHistory } from "vue-router";
import { storeToRefs } from "pinia";
import Account from "../views/Account.vue";
import Landing from "../views/Landing.vue";
import Terms from "../views/Terms.vue";
import NotFound from "../components/NotFound.vue";

import usePiniaStore from "@/store/pinia";
import useGroupsStore from "@/store/groups";
import useMessagesStore from "@/store/messages";
import { getStoredActiveGroup } from "@/utils";
import { Groups, Messages } from "@/api/messaging.service";
import { WebSocketService } from "@/api/websocket";
import { Users } from "@/api/users";

import "vue-router";

declare module "vue-router" {
  interface RouteMeta {
    title?: string;
    requiresAuth: boolean;
  }
}

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "Landing",
    component: Landing,
    meta: {
      title: "Cleartrace - Log In",
      requiresAuth: false,
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
    meta: {
      requiresAuth: true,
    },
  },
  {
    path: "/account",
    // path: "/account/:userID",
    name: "Account",
    component: Account,
    meta: {
      requiresAuth: true,
    },
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

router.beforeEach((to) => {
  const pinia = usePiniaStore();
  const { authenticated, debug } = storeToRefs(pinia);
  const sessionToken = localStorage.getItem("auth");

  if (
    to.name === "Landing" &&
    sessionToken &&
    sessionToken.length > 0 &&
    !authenticated.value
  ) {
    if (debug.value) console.info("Returning to an active session");
    pinia.setAuthenticated(true);
    return { name: "Home" };
  }
});

// This handles page refreshes or navigating back to the website
// during an active/expired session
router.beforeEach((to) => {
  const pinia = usePiniaStore();
  const sessionToken = localStorage.getItem("auth");

  // If the client is going to a protected route but doesn't have a session token or the client is not
  // authenticated, return to the landing page.
  if (to.meta.requiresAuth && (!sessionToken || !pinia.authenticated)) {
    return { name: "Landing" };
  }
});

// Loads home view data prior to
router.beforeEach(async (to) => {
  const pinia = usePiniaStore();
  const groupsStore = useGroupsStore();
  const messageStore = useMessagesStore();
  const { GetAllMessages } = Messages();
  const { GetGroups } = Groups();
  const { OpenSocketConnection } = WebSocketService();

  const { general, activeGroup } = storeToRefs(groupsStore);
  const { authenticated, awaitingComponentData } = storeToRefs(pinia);
  const sessionToken = localStorage.getItem("auth");

  if (to.name === "Home" && sessionToken && authenticated) {
    awaitingComponentData.value = true;
    // Load data
    const { GetUserById } = Users();
    const { user, error } = await GetUserById();

    if (!user || error) {
      throw error;
    }

    pinia.setUser(user);
    // To render the group names without current user in the group name, the user must be set first
    await GetGroups();

    // To get all messages, the group list must be populated. Then, this method populates the messageList for all groups
    await GetAllMessages();
    // const uniqueUsers = await userStore.getUniqueUsers(); // This populates uniqueUsers

    // GetGroups & GetAllMessages must be called beforehand in order for this block to work.
    // This is intended to populate the active group's messageList.
    const previousActiveGroup = getStoredActiveGroup();

    if (previousActiveGroup && previousActiveGroup.members.includes(user.id)) {
      groupsStore.setActiveGroup(previousActiveGroup);
    } else {
      const hydratedGeneralGroup = groupsStore.getGroupByID(general.value.id);
      groupsStore.setActiveGroup(hydratedGeneralGroup!, true);
    }

    // To get the message list of the active group, an active group & messageLists must both be set
    const messageList = messageStore.getMessageList(activeGroup.value.id);
    messageStore.setActiveMessageList(messageList!);
    // The GroupList component relies on this data
    groupsStore.setSortedGroupList();

    // The socket's onmessage handler requires a value for the active message list
    const websocket = await OpenSocketConnection();
    pinia.setSocket(websocket);
    awaitingComponentData.value = false;
  }
});

// After every route change vue updates the page title based on a value provided
// by the route object otherwise, if no value was provided, it uses DEFAULT_TITLE
router.afterEach((to) => {
  // Use next tick to handle router history correctly
  // see: https://github.com/vuejs/vue-router/issues/914#issuecomment-384477609
  nextTick(() => {
    document.title = to.meta.title || DEFAULT_TITLE;
  });
});

router.onError((_error, to) => {
  const pinia = usePiniaStore();
  const { awaitingComponentData } = storeToRefs(pinia);
  const { SignOut } = Users();

  if (to.name === "Home") {
    console.log(`router/index.ts:178`);
    awaitingComponentData.value = false;
    SignOut();
  }
});

export default router;
export { routes };
