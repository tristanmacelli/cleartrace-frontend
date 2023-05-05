import { State } from "@/store";
import axios from "axios";

import { computed, watch, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

export const Users = () => {
  const store = useStore<State>();
  const router = useRouter();
  const email = ref("");
  const firstName = ref("");
  const initials = ref("");
  const lastName = ref("");
  const password = ref("");
  const serverURL = computed(() => store.state.serverURL);
  const user = computed(() => store.state.user);

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
          store.commit("setAuthentication");
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
        store.commit("clearAuthentication");
        store.commit("clearSocket");
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
          store.commit("setAuthentication");
          router.push({ path: "/home" });
          // router.push({ name: 'Home', params: { groupID: groupID } });
        }
      })
      .catch((error) => {
        alert(error);
      });
  };
  const GetUser = async (serverURL: string) => {
    const sessionToken = localStorage.getItem("auth");
    const url = serverURL + "v1/users/";
    const resp = await axios
      .get(url, {
        headers: {
          Authorization: sessionToken,
        },
      })
      .then((response) => {
        // state.user = response.data;
        return response;
      })
      .catch((error) => {
        // eslint-disable-next-line
        // if (debug) {
        //   console.log(error);
        // }
        return error;
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

  const SetInitials = () => {
    if (user.value) {
      initials.value =
        user.value.FirstName.charAt(0) + user.value.LastName.charAt(0);
    }
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
    SetInitials,
    GetUser,
    UpdateUser,
  };
};

export const Search = () => {
  const store = useStore<State>();
  const awaitingSearch = ref(false);
  const query = ref("");
  const searchResults = ref<UserSearchResult[]>([]);
  const serverURL = computed(() => store.state.serverURL);
  const userID = computed(() => store.state.user?.id);
  const userIDs = ref<number[]>([]);
  const users = ref<Member[]>([]);

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
                const reducedUsr = {
                  id: user.ID,
                  text: user.FirstName + " " + user.LastName,
                  img: user.PhotoURL,
                };
                searchResults.value.push(reducedUsr);
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
            const member = {
              id: user.ID + "",
              name: user.FirstName + " " + user.LastName,
            };
            users.value.push(member);
          });
      });
  };
  return {
    query,
    searchResults,
    users,
    userIDs,
    GetUsersFromIDs,
    SearchUsers,
  };
};
