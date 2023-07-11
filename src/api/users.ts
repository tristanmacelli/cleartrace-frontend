import axios from "axios";

import { watch, ref } from "vue";
import { useRouter } from "vue-router";
import usePiniaStore from "@/store/pinia";
// import useUserStore from "@/store/users";
import { Member, ServerUser, UserSearchResult } from "../types";
import {
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
  serverUserToMember,
  serverUserToUserSearchResult,
} from "@/utils";
import { storeToRefs } from "pinia";

const api_url = import.meta.env.VITE_CLEARTRACE_API;

export const Users = () => {
  const pinia = usePiniaStore();
  // const userStore = useUserStore();
  const { user } = storeToRefs(pinia);
  const router = useRouter();
  const email = ref<string>("");
  const firstName = ref<string>("");
  const lastName = ref<string>("");
  const password = ref<string>("");

  const SignIn = async () => {
    const url = api_url + "v1/sessions";
    if (!email.value || !password.value) {
      alert("Error: Invalid Credentials");
      return;
    }

    const { response, error } = await postRequest<
      { Email: string; Password: string },
      void
    >(url, {
      Email: email.value,
      Password: password.value,
    });

    if (error) {
      alert(error);
    }
    if (!response) return;

    const sessionToken = response.headers["authorization"];
    if (sessionToken) {
      localStorage.setItem("auth", sessionToken);
      pinia.setAuthenticated(true);
      router.push({ path: "/home" });
    }
  };

  const SignOut = async () => {
    const url = api_url + "v1/sessions/mine";
    const sessionToken = localStorage.getItem("auth");

    // send a DELETE request with the above data
    const { error } = await deleteRequest<void>(url, {
      headers: { Authorization: sessionToken },
    });
    if (error) {
      alert(error);
    }

    localStorage.removeItem("auth");
    pinia.setAuthenticated(false);
    pinia.clearSocket();
    if (router.currentRoute.value.path != "/") {
      router.push({ path: "/" });
    }
  };

  const SignUp = async () => {
    const url = api_url + "v1/users";
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
    const { response, error } = await postRequest<typeof user, void>(url, user);

    if (error) {
      alert(error);
    }
    if (!response) return;

    const sessionToken = response.headers["authorization"];
    if (sessionToken) {
      localStorage.setItem("auth", sessionToken);
      pinia.setAuthenticated(true);
      router.push({ path: "/home" });
      // router.push({ name: 'Home', params: { groupID: groupID } });
    }
  };

  const GetUser = async (): Promise<{ user?: ServerUser; error?: Error }> => {
    const sessionToken = localStorage.getItem("auth");
    const url = api_url + "v1/users/";

    const { data, error } = await getRequest<ServerUser>(url, {
      headers: { Authorization: sessionToken },
    });

    if (pinia.debug && error) console.log(`Error retrieving user: ${error}`);

    return {
      user: data,
      error,
    };
  };

  // TODO: create backend endpoint to return user information
  // const GetUserById = async (
  //   id: number
  // ): Promise<{ user?: LocalUser; error?: Error }> => {
  //   const sessionToken = localStorage.getItem("auth");
  //   const url = api_url + "v1/users/" + id;

  //   const { data, error } = await getRequest<ServerUser>(url, {
  //     headers: { Authorization: sessionToken },
  //   });

  //   if (error) {
  //     // eslint-disable-next-line
  //     if (pinia.debug) console.log(`Error retrieving user: ${error}`);
  //     return {
  //       user: undefined,
  //       error,
  //     };
  //   }
  //   if (!data) {
  //     return {
  //       user: undefined,
  //       error: new Error("No user data"),
  //     };
  //   }

  //   const user = serverToClientUser(data);
  //   userStore.addUniqueUser(user);

  //   return {
  //     user,
  //     error,
  //   };
  // };

  const UpdateUser = async () => {
    const url = api_url + "v1/users/me";
    if (!firstName.value || !lastName.value) {
      alert("Error: Invalid name change, names must not be blank");
      return;
    }

    const sessionToken = localStorage.getItem("auth");
    const nameChange = {
      FirstName: firstName,
      LastName: lastName,
    };

    // send a get request with the above data
    const { error } = await patchRequest<typeof nameChange, void>(
      url,
      nameChange,
      {
        headers: { Authorization: sessionToken },
      }
    );
    if (error) {
      alert(error);
    }

    // TODO: Check back end to see if endpoint supports new request formatting above (below was previous formatting)
    // await axios.patch(url, {
    //   headers: {
    //     Authorization: sessionToken,
    //   },
    //   FirstName: firstName,
    //   LastName: lastName,
    // });
    // Since there are no errors and the name fields are updated locally, there is no need to
    // make a request for user information until the user returns to this page later
  };

  return {
    email,
    firstName,
    lastName,
    password,
    user,
    SignIn,
    SignOut,
    SignUp,
    GetUser,
    // GetUserById,
    UpdateUser,
  };
};

export const Search = () => {
  const pinia = usePiniaStore();
  const { getUserID } = storeToRefs(pinia);
  const awaitingSearch = ref<boolean>(false);
  const query = ref<string>("");
  const searchResults = ref<UserSearchResult[]>([]);
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
    if (query.value.length === 0) {
      // Clear results when there is no query
      searchResults.value = [];
      return;
    }
    // Clear results on a new search
    searchResults.value = [];
    // Show a loading animation component/svg
    const url = api_url + "v1/users/search/?q=" + query.value;
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
          const receivedUsers: ServerUser[] = response.data;

          searchResults.value = receivedUsers
            .filter((user: ServerUser) => user.ID != getUserID.value)
            .map((user: ServerUser) => {
              return serverUserToUserSearchResult(user);
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
    const url = api_url + "v1/users/search/";
    const sessionToken = localStorage.getItem("auth");

    const { data, error } = await postRequest<number[], ServerUser[]>(
      url,
      userIDs.value,
      {
        headers: { Authorization: sessionToken },
      }
    );

    if (error) {
      alert(error);
    }

    if (!data) {
      alert("no users present");
      return;
    }

    members.value = data.map((user: ServerUser) => {
      return serverUserToMember(user);
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
