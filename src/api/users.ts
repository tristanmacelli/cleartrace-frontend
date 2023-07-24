import { watch, ref } from "vue";
import { useRouter } from "vue-router";
import usePiniaStore from "@/store/pinia";
import { LocalUser, Member, ServerUser, UserSearchResult } from "../types";
import { WebSocketService } from "@/api/websocket";
import {
  deleteRequest,
  getRequest,
  patchRequest,
  postRequest,
  serverToClientUser,
  serverUserToMember,
  serverUserToUserSearchResult,
} from "@/utils";
import { storeToRefs } from "pinia";

const api_url = import.meta.env.VITE_CLEARTRACE_API;
const INVALID_CREDENTIALS_ERROR =
  "Error: the email and/or password was incorrect";
const INVALID_NEW_USER_ERROR = "Error: the new user data is invalid";

// TODO: Refactor functions, removing side effects caused after requests return
export const Users = () => {
  const pinia = usePiniaStore();
  // const userStore = useUserStore();
  const { debug, user } = storeToRefs(pinia);
  const { ClearSocket } = WebSocketService();
  const router = useRouter();
  const email = ref<string>("");
  const firstName = ref<string>("");
  const lastName = ref<string>("");
  const password = ref<string>("");

  const HandleAuthenticationData = (sessionToken: string, user: LocalUser) => {
    if (!sessionToken) {
      return;
    }
    localStorage.setItem("auth", sessionToken);
    localStorage.setItem("userID", `${user.id}`);
    pinia.setAuthenticated(true);
    pinia.setUser(user);
    router.push({ path: "/home" });
    // router.push({ name: 'Home', params: { groupID: groupID } });
  };

  const SignIn = async (): Promise<{
    sessionToken?: string;
    user?: LocalUser;
    error?: Error;
  }> => {
    const url = api_url + "v1/sessions";
    if (!email.value || !password.value) {
      if (debug.value) {
        console.error(INVALID_CREDENTIALS_ERROR);
      }
      return {
        error: new Error(INVALID_CREDENTIALS_ERROR),
      };
    }
    const credentials = {
      Email: email.value,
      Password: password.value,
    };

    const { response, data, error } = await postRequest<
      typeof credentials,
      ServerUser
    >(url, credentials);

    if (error) {
      if (debug.value) {
        console.error(INVALID_CREDENTIALS_ERROR);
      }
      return {
        error: new Error(INVALID_CREDENTIALS_ERROR),
      };
    }
    if (!response || !data) return {};

    const user = serverToClientUser(data);
    HandleAuthenticationData(response.headers["authorization"], user);
    return {
      sessionToken: response.headers["authorization"],
      user,
    };
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
      return;
    }

    localStorage.removeItem("auth");
    localStorage.removeItem("userID");
    pinia.setAuthenticated(false);
    ClearSocket();
    if (router.currentRoute.value.path != "/") {
      router.push({ path: "/" });
    }
  };

  const SignUp = async (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ): Promise<{
    sessionToken?: string;
    user?: LocalUser;
  }> => {
    const url = api_url + "v1/users";
    const username = firstName + "." + lastName;

    if (!email || !password) {
      if (debug.value) {
        console.error(INVALID_NEW_USER_ERROR);
      }
      return {};
    }
    const user = {
      Email: email,
      Password: password,
      PasswordConf: password,
      UserName: username,
      FirstName: firstName,
      LastName: lastName,
    };
    const { response, data, error } = await postRequest<
      typeof user,
      ServerUser
    >(url, user);

    if (error) {
      if (debug.value) {
        console.error(INVALID_NEW_USER_ERROR);
      }
      return {};
    }
    if (!response || !data) return {};

    const newUser = serverToClientUser(data);
    HandleAuthenticationData(response.headers["authorization"], newUser);
    return {
      sessionToken: response.headers["authorization"],
      user: newUser,
    };
  };

  // GetUserById
  const GetUserById = async (
    userID?: string
  ): Promise<{ user?: LocalUser; error?: Error }> => {
    const sessionToken = localStorage.getItem("auth");
    const currentUserID = user.value?.id || localStorage.getItem("userID");
    // If an userID is passed, prefer that value. Otherwise, use the current user's id
    const id = userID || currentUserID;
    const url = api_url + "v1/users/" + id;

    const { data, error } = await getRequest<ServerUser>(url, {
      headers: { Authorization: sessionToken },
    });

    if (error) {
      console.error(`Error retrieving user: ${error}`);
      return { error };
    }
    if (!data) return { error: new Error("No User Found") };

    return {
      user: serverToClientUser(data),
      error,
    };
  };

  // GetUserByEmail
  const GetUserByEmail = async (
    email: string
  ): Promise<{ foundUser?: boolean; error?: Error }> => {
    const sessionToken = localStorage.getItem("auth");
    const url = api_url + "v1/users/email/" + email;

    const { data, error } = await getRequest<{ foundUser: boolean }>(url, {
      headers: { Authorization: sessionToken },
    });

    if (error) {
      console.error(`Error retrieving user: ${error}`);
      return { error };
    }
    if (!data) return { error: new Error("No User Found") };

    return {
      foundUser: data.foundUser,
      error,
    };
  };

  const UpdateUser = async (): Promise<{
    user?: LocalUser;
    error?: Error;
  }> => {
    const url = api_url + "v1/users/me";
    if (!firstName.value || !lastName.value) {
      alert("Error: Invalid name change, names must not be blank");
      return {
        error: new Error("Invalid name change, names must not be blank"),
      };
    }

    const sessionToken = localStorage.getItem("auth");
    const nameChange = {
      FirstName: firstName,
      LastName: lastName,
    };

    // send a get request with the above data
    const { data, error } = await patchRequest<typeof nameChange, ServerUser>(
      url,
      nameChange,
      {
        headers: { Authorization: sessionToken },
      }
    );
    if (error) {
      alert(error);
      return { error };
    }
    if (!data) {
      return { error: new Error("") };
    }
    return { user: serverToClientUser(data) };

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
    GetUserById,
    GetUserByEmail,
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

    const { data, error } = await getRequest<ServerUser[]>(url, {
      headers: {
        Authorization: sessionToken,
      },
    });

    if (error) {
      alert(error);
      return;
    }

    if (!data) {
      // Hide results list if there are no results
      return;
    }

    const userSearchResults = data
      .filter((user: ServerUser) => user.ID != getUserID.value)
      .map((user: ServerUser) => {
        return serverUserToUserSearchResult(user);
      });
    searchResults.value = userSearchResults;
    return userSearchResults;
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

    const userMembers = data.map((user: ServerUser) => {
      return serverUserToMember(user);
    });
    members.value = userMembers;
    return userMembers;
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
