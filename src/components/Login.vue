<template>
  <div id="login">
    <form v-on:submit.prevent="SignIn" accept-charset="UTF-8">
      <table cellspacing="0" role="presentation">
        <tbody>
          <tr>
            <td>
              <label for="emailSess">Email</label>
            </td>
            <td>
              <label for="passSess">Password</label>
            </td>
          </tr>
          <tr>
            <td>
              <input id="emailSess" v-model="LogInEmail" type="text" />
            </td>
            <td>
              <input id="passSess" v-model="LogInPass" type="password" />
            </td>
            <td>
              <input id="logInBtn" type="submit" value="Log In" />
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  </div>
</template>

<script>
export default {
  name: "login",
  data() {
    return {
      LogInEmail: "",
      LogInPass: ""
    };
  },
  methods: {
    // Creating a new session based on the form values
    async SignIn() {
      let url = "https://slack.api.tristanmacelli.com/v1/sessions";
      let email = this.LogInEmail;
      let password = this.LogInPass;
      if (!email || !password) {
        alert("Error: Invalid Credentials");
        return;
      }

      let body = {
        Email: email,
        Password: password
      };
      // send a get request with the above data
      let resp = await fetch(url, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });
      if (!resp.ok) {
        let message = "Error: " + resp.status.toString();
        alert(message);
      }

      let hasAuth = resp.headers.has("authorization");
      if (hasAuth) {
        let sessionToken = resp.headers.get("authorization");
        localStorage.setItem("auth", sessionToken);
        this.$store.commit("setAuthentication");
        this.$store.commit("setSocket");
        this.$store.commit("setUser");
        this.$router.push({ path: "/home" });
        // this.$router.push({ name: 'Home', params: { groupID: storedGroupID } });
      }
    }
  },
  computed: {
    // a computed getter
    storedGroupID() {
      return this.$store.getters.getGroupID;
    }
  }
};
</script>

<style scoped>
label {
  color: white;
  font-size: 0.8em;
}

#emailSess,
#passSess {
  width: 10rem;
}

#logInBtn {
  background-color: #204a7e;
  border-radius: 1.5px;
  border: 0;
  padding: 0.3em 0.8em;
  font-weight: bold;
  color: white;
  border: 1px solid #1a3666;
  margin-bottom: 5px;
  cursor: pointer;
}
</style>
