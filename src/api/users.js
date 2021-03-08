import axios from "axios";

export async function SignIn(serverURL, email, password) {
  let url = serverURL + "v1/sessions";
  if (!email || !password) {
    alert("Error: Invalid Credentials");
    return;
  }

  axios
    .post(url, {
      Email: email,
      Password: password
    })
    .catch(error => {
      alert(error);
    })
    .then(response => {
      let sessionToken = response.headers["authorization"];
      if (sessionToken) {
        localStorage.setItem("auth", sessionToken);
        this.$store.commit("setAuthentication");
        this.$store.commit("setSocket");
        this.$store.commit("setUser");
        this.$router.push({ path: "/home" });
        // this.$router.push({ name: 'Home', params: { groupID: groupID } });
      }
    });
}

export async function SignOut(serverURL) {
  let url = serverURL + "v1/sessions/mine";
  let sessionToken = localStorage.getItem("auth");

  // send a DELETE request with the above data
  axios
    .delete(url, {
      headers: {
        Authorization: sessionToken
      }
    })
    .catch(error => {
      alert(error);
    })
    .then(() => {
      localStorage.removeItem("auth");
      this.$store.commit("clearAuthentication");
      this.$store.commit("clearSocket");
      if (this.$router.currentRoute != "/") {
        this.$router.push({ path: "/" });
      }
    });
}

export async function SignUp(serverURL, email, password, firstName, lastName) {
  let url = serverURL + "v1/users";
  let username = firstName + "." + lastName;

  if (!email || !password) {
    alert("Error: Invalid New User Input");
    return;
  }
  axios
    .post(url, {
      Email: email,
      Password: password,
      PasswordConf: password,
      UserName: username,
      FirstName: firstName,
      LastName: lastName
    })
    .catch(error => {
      alert(error);
    })
    .then(response => {
      let sessionToken = response.headers["authorization"];
      if (sessionToken) {
        localStorage.setItem("auth", sessionToken);
        this.$store.commit("setAuthentication");
        this.$store.commit("setSocket");
        this.$store.commit("setUser");
        this.$router.push({ path: "/home" });
        // this.$router.push({ name: 'Home', params: { groupID: groupID } });
      }
    });
}

export async function GetUser(serverURL, debug) {
  let sessionToken = localStorage.getItem("auth");
  let url = serverURL + "v1/users/";
  await axios
    .get(url, {
      headers: {
        Authorization: sessionToken
      }
    })
    .catch(error => {
      // eslint-disable-next-line
      if (debug) {
        console.log(error);
      }
    })
    .then(response => {
      console.log(response);
      // state.user = response.data;
    });
}
