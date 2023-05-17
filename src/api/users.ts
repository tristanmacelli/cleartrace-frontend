// import { State } from "@/store";
import axios from "axios";

import { computed, watch, ref } from "vue";
import { useRouter } from "vue-router";
import usePiniaStore from "@/store/pinia";
import { Member, ServerUser, UserSearchResult } from "../types";
import { serverUserToMember, serverUserToUserSearchResult } from "@/utils";

export const Users = () => {
  const pinia = usePiniaStore();
  const router = useRouter();
  const email = ref("");
  const firstName = ref("");
  const initials = computed(() => pinia.userInitials);
  const lastName = ref("");
  const password = ref("");
  const serverURL = computed(() => pinia.serverURL);
  const user = computed(() => pinia.user);

  const SignIn = async () => {
    const url = serverURL.value + "v1/sessions";
    if (!email.value || !password.value) {
      alert("Error: Invalid Credentials");
      return;
    }

    await axios
      .post(url, {
        Email: email.value,
        Password: password.value,
      })
      .then((response) => {
        const sessionToken = response.headers["authorization"];
        if (sessionToken) {
          localStorage.setItem("auth", sessionToken);
          pinia.authenticated = true;
          // store.commit("setAuthentication");
          router.push({ path: "/home" });
          // router.push({ name: 'Home', params: { groupID: groupID } });
        }
      })
      .catch((error) => {
        alert(error);
      });
  };

  const SignOut = async () => {
    const url = serverURL.value + "v1/sessions/mine";
    const sessionToken = localStorage.getItem("auth");

    // send a DELETE request with the above data
    await axios
      .delete(url, {
        headers: {
          Authorization: sessionToken,
        },
      })
      .then(() => {
        localStorage.removeItem("auth");
        pinia.authenticated = false;
        pinia.clearSocket();
        // store.commit("clearAuthentication");
        // store.commit("clearSocket");
        if (router.currentRoute.value.path != "/") {
          router.push({ path: "/" });
        }
      })
      .catch((error) => {
        alert(error);
      });
  };

  const SignUp = async () => {
    const url = serverURL.value + "v1/users";
    const username = firstName.value + "." + lastName.value;

    if (!email.value || !password.value) {
      alert("Error: Invalid New User Input");
      // TODO: alter a field condition to style the input border red, indicating incorrect input
      return;
    }
    const user = {
      Email: email.value,
      Password: password.value,
      PasswordConf: password.value,
      UserName: username,
      FirstName: firstName.value,
      LastName: lastName.value,
    };
    await axios
      .post(url, {
        user,
      })
      .then((response) => {
        const sessionToken = response.headers["authorization"];
        if (sessionToken) {
          localStorage.setItem("auth", sessionToken);
          pinia.authenticated = true;
          // store.commit("setAuthentication");
          router.push({ path: "/home" });
          // router.push({ name: 'Home', params: { groupID: groupID } });
        }
      })
      .catch((error) => {
        alert(error);
      });
  };

  const GetUser = async (
    serverURL: string
  ): Promise<{ user?: ServerUser; error?: Error }> => {
    const sessionToken = localStorage.getItem("auth");
    const url = serverURL + "v1/users/";
    const resp = await axios
      .get(url, {
        headers: {
          Authorization: sessionToken,
        },
      })
      .then((response) => {
        return {
          user: response.data as ServerUser,
        };
      })
      .catch((error: Error) => {
        // eslint-disable-next-line
        if (pinia.debug) console.log(`Error retrieving user: ${error}`);
        return {
          error: error,
        };
      });
    return resp;
  };

  const UpdateUser = async () => {
    const url = serverURL.value + "v1/users/me";
    if (!firstName.value || !lastName.value) {
      alert("Error: Invalid name change, names must not be blank");
      return;
    }

    const sessionToken = localStorage.getItem("auth");

    // send a get request with the above data
    axios
      .patch(url, {
        headers: {
          Authorization: sessionToken,
        },
        FirstName: firstName,
        LastName: lastName,
      })
      .catch((error) => {
        alert(error);
      });
    // Since there are no errors and the name fields are updated locally, there is no need to
    // make a request for user information until the user returns to this page later
  };

  return {
    email,
    firstName,
    initials,
    lastName,
    password,
    user,
    SignIn,
    SignOut,
    SignUp,
    GetUser,
    UpdateUser,
  };
};

export const Search = () => {
  const pinia = usePiniaStore();
  const awaitingSearch = ref(false);
  const query = ref("");
  const searchResults = ref<UserSearchResult[]>([]);
  const serverURL = computed(() => pinia.serverURL);
  const userID = computed(() => pinia.user?.id);
  const userIDs = ref<number[]>([]);
  const members = ref<Member[]>([]);

  watch(query, () => {
    if (!awaitingSearch.value) {
      setTimeout(() => {
        SearchUsers();
        awaitingSearch.value = false;
      }, 1000); // 1 sec delay
    }
    awaitingSearch.value = true;
  });

  const SearchUsers = async () => {
    // Do not query the backend if there is nothing to querys
    if (query.value.length == 0) {
      // Clear results when there is no query
      searchResults.value = [];
      return;
    }
    // Clear results on a new search
    searchResults.value = [];
    // Show a loading animation component/svg
    const url = serverURL.value + "v1/users/search/?q=" + query.value;
    const sessionToken = localStorage.getItem("auth");

    axios
      .get(url, {
        headers: {
          Authorization: sessionToken,
        },
      })
      .catch((error) => {
        alert(error);
      })
      .then((response) => {
        if (response && response.data) {
          const receivedUsers = response.data;
          receivedUsers
            .slice()
            .reverse()
            .forEach((user: ServerUser) => {
              if (user.ID != userID.value) {
                const reducedUser: UserSearchResult =
                  serverUserToUserSearchResult(user);
                searchResults.value.push(reducedUser);
              }
            });
          if (searchResults.value.length > 0) {
            // Hide loading animation component
          }
          return;
        }
        // Hide results list if there are no results
      });
  };

  const GetUsersFromIDs = async () => {
    const url = serverURL.value + "v1/users/search/";
    const sessionToken = localStorage.getItem("auth");

    await axios
      .post(url, userIDs.value, {
        headers: {
          Authorization: sessionToken,
        },
      })
      .catch((error) => {
        alert(error);
      })
      .then((response) => {
        if (!response || !response.data) {
          alert("no users present");
          return;
        }
        const receivedUsers = response.data;
        receivedUsers
          .slice()
          .reverse()
          .forEach((user: ServerUser) => {
            const member: Member = serverUserToMember(user);
            members.value.push(member);
          });
      });
  };
  return {
    query,
    searchResults,
    users: members,
    userIDs,
    GetUsersFromIDs,
    SearchUsers,
  };
};
