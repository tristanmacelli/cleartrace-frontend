import axios from "axios";

import { computed, watch, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

export const Users = () => {
  const store = useStore();
  const router = useRouter();
  const email = ref("");
  const firstName = ref("");
  const initials = ref("");
  const lastName = ref("");
  const password = ref("");
  const serverURL = computed(() => store.state.serverURL);
  const user = computed(() => store.state.user);
  // const groupID = computed(() => store.state.group.id);

  async function SignIn() {
    let url = serverURL.value + "v1/sessions";
    if (!email.value || !password.value) {
      alert("Error: Invalid Credentials");
      return;
    }

    await axios
      .post(url, {
        Email: email.value,
        Password: password.value
      })
      .then(response => {
        let sessionToken = response.headers["authorization"];
        if (sessionToken) {
          localStorage.setItem("auth", sessionToken);
          store.commit("setAuthentication");
          store.commit("setSocket");
          store.commit("setUser");
          router.push({ path: "/home" });
          // router.push({ name: 'Home', params: { groupID: groupID } });
        }
      })
      .catch(error => {
        alert(error);
      });
  }

  async function SignOut() {
    let url = serverURL.value + "v1/sessions/mine";
    let sessionToken = localStorage.getItem("auth");

    // send a DELETE request with the above data
    await axios
      .delete(url, {
        headers: {
          Authorization: sessionToken
        }
      })
      .then(() => {
        localStorage.removeItem("auth");
        store.commit("clearAuthentication");
        store.commit("clearSocket");
        if (router.currentRoute != "/") {
          router.push({ path: "/" });
        }
      })
      .catch(error => {
        alert(error);
      });
  }

  async function SignUp() {
    let url = serverURL.value + "v1/users";
    let username = firstName.value + "." + lastName.value;

    if (!email.value || !password.value) {
      alert("Error: Invalid New User Input");
      return;
    }
    let user = {
      Email: email,
      Password: password,
      PasswordConf: password,
      UserName: username,
      FirstName: firstName,
      LastName: lastName
    };
    await axios
      .post(url, {
        user
      })
      .then(response => {
        let sessionToken = response.headers["authorization"];
        if (sessionToken) {
          localStorage.setItem("auth", sessionToken);
          store.commit("setAuthentication");
          store.commit("setSocket");
          store.commit("setUser");
          router.push({ path: "/home" });
          // router.push({ name: 'Home', params: { groupID: groupID } });
        }
      })
      .catch(error => {
        alert(error);
      });
  }
  async function GetUser(serverURL) {
    let sessionToken = localStorage.getItem("auth");
    let url = serverURL + "v1/users/";
    let resp = await axios
      .get(url, {
        headers: {
          Authorization: sessionToken
        }
      })
      .then(response => {
        // state.user = response.data;
        return response;
      })
      .catch(error => {
        // eslint-disable-next-line
        // if (debug) {
        //   console.log(error);
        // }
        return error;
      });
    return resp;
  }

  async function UpdateUser() {
    var url = serverURL.value + "v1/users/me";
    if (!firstName.value || !lastName.value) {
      alert("Error: Invalid name change, names must not be blank");
      return;
    }

    let sessionToken = localStorage.getItem("auth");

    // send a get request with the above data
    axios
      .patch(url, {
        headers: {
          Authorization: sessionToken
        },
        FirstName: firstName,
        LastName: lastName
      })
      .catch(error => {
        alert(error);
      });
    // Since there are no errors and the name fields are updated locally, there is no need to
    // make a request for user information until the user returns to this page later
  }

  function GetInitials() {
    initials.value =
      user.value.FirstName.charAt(0) + user.value.LastName.charAt(0);
  }

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
    GetInitials,
    GetUser,
    UpdateUser
  };
};

export const Search = () => {
  const store = useStore();
  const awaitingSearch = ref(false);
  const query = ref("");
  const searchResults = ref([]);
  const serverURL = computed(() => store.state.serverURL);
  const userID = computed(() => store.state.user.id);
  const userIDs = ref([]);
  const users = ref([]);

  watch(query, () => {
    if (!awaitingSearch.value) {
      setTimeout(() => {
        SearchUsers();
        awaitingSearch.value = false;
      }, 1000); // 1 sec delay
    }
    awaitingSearch.value = true;
  });

  async function SearchUsers() {
    // Do not query the backend if there is nothing to querys
    if (query.value.length == 0) {
      // Clear results when there is no query
      searchResults.value = [];
      return;
    }
    // Clear results on a new search
    searchResults.value = [];
    // Show a loading animation component/svg
    let url = serverURL.value + "v1/users/search/?q=" + query.value;
    let sessionToken = localStorage.getItem("auth");

    axios
      .get(url, {
        headers: {
          Authorization: sessionToken
        }
      })
      .catch(error => {
        alert(error);
      })
      .then(response => {
        let receivedUsers = response.data;
        if (response.data) {
          receivedUsers
            .slice()
            .reverse()
            .forEach(user => {
              if (user.ID != userID.value) {
                let reducedUsr = {
                  id: user.ID,
                  text: user.FirstName + " " + user.LastName,
                  img: user.PhotoURL
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
  }

  async function GetUsersFromIDs() {
    let url = serverURL.value + "v1/users/search/";
    let sessionToken = localStorage.getItem("auth");

    await axios
      .post(url, userIDs.value, {
        headers: {
          Authorization: sessionToken
        }
      })
      .catch(error => {
        alert(error);
      })
      .then(response => {
        let receivedUsers = response.data;
        if (receivedUsers == null) {
          alert("no users present");
          return;
        }
        receivedUsers
          .slice()
          .reverse()
          .forEach(user => {
            let member = {
              id: user.ID,
              name: user.FirstName + " " + user.LastName
            };
            users.value.push(member);
          });
      });
  }
  return {
    query,
    searchResults,
    users,
    userIDs,
    GetUsersFromIDs,
    SearchUsers
  };
};
