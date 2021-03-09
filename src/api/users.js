import axios from "axios";

import { computed, ref } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";

export const Users = () => {
  const store = useStore();
  const router = useRouter();
  const email = ref("");
  const password = ref("");
  const firstName = ref("");
  const lastName = ref("");
  const serverURL = computed(() => store.state.serverURL);
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

  return {
    email,
    password,
    firstName,
    lastName,
    SignIn,
    SignOut,
    SignUp,
    GetUser
  };
};
