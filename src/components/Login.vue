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
              <input id="sessBtn" type="submit" value="Log In" />
            </td>
          </tr>
        </tbody>
      </table>
    </form>
  </div>
</template>

<script>
import EventBus from "@/event-bus";

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
      // console.log("Entered Authenticate");
      // let url = "https://slack.api.tristanmacelli.com/v1/sessions";
      let email = this.LogInEmail;
      let password = this.LogInPass;
      if (!email || !password) {
        alert("Error: Invalid Credentials");
        return;
      }
      // console.log(email);
      // console.log(password);

      // let body = {
      //   Email: email,
      //   Password: password
      // };
      // console.log("Pre-fetch");
      // // send a get request with the above data
      // let resp = await fetch(url, {
      //   method: "POST",
      //   headers: {
      //     Accept: "application/json",
      //     "Content-Type": "application/json"
      //   },
      //   body: JSON.stringify(body)
      // });
      // console.log("Post-fetch");
      // if (!resp.ok) {
      //   let message = "Error: " + resp.status.toString();
      //   alert(message);
      // }
      // console.log("Request was OK");
      // let response = await resp.json();
      // console.log(response);

      // let sessionToken = ""; //xhr.getResponseHeader('authorization')
      // localStorage.setItem("auth", sessionToken);
      // console.log("Success");
      EventBus.$emit("toggle-authentication");
      this.$router.push({ path: "/home" });
    }
  }
};
</script>

<style scoped>
label {
  color: white;
}

#sessBtn {
  background-color: #2e619e;
  border-radius: 3px;
  border-color: #2e619e;
  color: white;
}
</style>
