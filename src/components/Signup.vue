<template>
  <div id="signup">
    <div class="raised">
      <h3>Create an Account</h3>
      <p>It's easy!</p>
      <form id="createuser" v-on:submit.prevent="SignUp" accept-charset="UTF-8">
        <table cellspacing="0" role="presentation">
          <tbody>
            <tr id="names">
              <td>
                <input
                  type="text"
                  v-model="NewFirstName"
                  id="firstname"
                  placeholder="First name"
                />
              </td>
              <td>
                <input
                  type="text"
                  v-model="NewLastName"
                  id="lastname"
                  placeholder="Last name"
                />
              </td>
            </tr>
            <tr>
              <td>
                <input
                  type="text"
                  v-model="NewEmail"
                  id="email"
                  placeholder="Email"
                />
              </td>
            </tr>
            <tr>
              <td>
                <input
                  type="password"
                  v-model="NewPassword"
                  id="pass"
                  placeholder="New password"
                />
              </td>
            </tr>
            <div>
              <p>
                By clicking Sign Up, you agree to our
                <a href="/legal/terms">Terms of Service</a>.
              </p>
            </div>
            <tr>
              <td>
                <input type="submit" id="userBtn" value="Sign Up" />
              </td>
            </tr>
          </tbody>
        </table>
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: "signup",
  data() {
    return {
      NewFirstName: "",
      NewLastName: "",
      NewEmail: "",
      NewPassword: ""
    };
  },
  methods: {
    async SignUp() {
      // let url = "https://slack.api.tristanmacelli.com/v1/users";
      // let username = this.FirstName + "." + this.LastName;

      if (!this.NewEmail || !this.NewPassword) {
        alert("Error: Invalid New User Input");
        return;
      }

      // let body = {
      //   Email: this.NewEmail,
      //   Password: this.Password,
      //   PasswordConf: this.Password,
      //   UserName: username,
      //   FirstName: this.FirstName,
      //   LastName: this.LastName
      // };

      // let resp = await fetch(url, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json"
      //   },
      //   body: JSON.stringify(body)
      // });
      // if (!resp.ok) {
      //   let message = "Error: " + resp.status.toString();
      //   alert(message);
      // }
      // let response = await resp.json();

      // let sessionToken = "";
      // localStorage.setItem("auth", sessionToken);
      console.log("Success");
      this.$emit("toggle-authentication");
      this.$router.push({ path: "/home" });
      // send a get request with the above data
    }
  }
};
</script>

<style>
#signup {
  padding-left: 4em;
}

.raised {
  background-color: #c5c5c5;
  padding: 0.6em 1.8em;
  border-radius: 6px;
  width: fit-content;
}

.raised td {
  display: unset;
  margin-right: 0.3em;
}

#names input {
  display: unset;
  width: 13.2em;
}

#email,
#pass {
  width: 94%;
}

.raised input[type="text"],
.raised input[type="password"] {
  width: 2em;
  height: 2em;
  margin-bottom: 1em;
}

#userBtn {
  color: white;
  background-color: #69a74e;
  font: 400 13.3333 Arial;
  font-weight: bold;
  border-radius: 6px;
  border: 0;
  padding: 0.8em 3.8em;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.5);
  cursor: pointer;
  background: linear-gradient(#67ae55, #578843);
  background-color: #69a74e;
  box-shadow: inset 0 1px 1px #a4e388;
  border-color: #3b6e22 #3b6e22 #2c5115;
}
</style>
