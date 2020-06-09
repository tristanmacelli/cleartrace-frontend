<template>
  <div id="signup" class="main">
    <h3>Sign up</h3>
    <p>It's easy!</p>
    <form id="createuser" v-on:submit.prevent="SignUp" accept-charset="UTF-8">
      <table cellspacing="0" role="presentation">
        <tbody>
          <tr>
            <td>
              <input
                type="text"
                v-model="NewFirstName"
                id="firstname"
                placeholder="First Name"
              />
            </td>
            <td>
              <input
                type="text"
                v-model="NewLastName"
                id="lastname"
                placeholder="Last Name"
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
                placeholder="New Password"
              />
            </td>
          </tr>
          <tr>
            <td>
              <input type="submit" id="userBtn" value="submit" />
            </td>
          </tr>
        </tbody>
      </table>
    </form>
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
