<template>
  <div id="userInfo">
    <form
      id="createuser"
      v-on:submit.prevent="UpdateUser"
      accept-charset="UTF-8"
    >
      <table cellspacing="0" role="presentation">
        <tbody>
          <tr>
            <td><p>Username:</p></td>
            <td>
              <p id="account-username">
                {{ UserName }}
              </p>
            </td>
          </tr>

          <tr>
            <td>
              <label for="account-firstname">First Name</label>
            </td>
            <td>
              <label for="account-lastname">Last Name</label>
            </td>
          </tr>
          <tr>
            <td>
              <input
                id="account-firstname"
                type="text"
                v-model="FirstNameUpdate"
                value=""
              />
            </td>
            <td>
              <input
                id="account-lastname"
                type="text"
                v-model="LastNameUpdate"
                value=""
              />
            </td>
            <td><input type="submit" id="userBtn" value="CHANGE" /></td>
          </tr>
        </tbody>
      </table>
    </form>
  </div>
</template>

<script>
export default {
  name: "user",
  data() {
    return {
      FirstNameUpdate: "",
      LastNameUpdate: "",
      UserName: ""
    };
  },
  created: async function() {
    let url = "https://slack.api.tristanmacelli.com/v1/users/";
    let sessionToken = localStorage.getItem("auth");
    let resp = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: sessionToken
      }
    });
    if (!resp.ok) {
      alert("Error: ", resp.status);
    }
    let response = await resp.json();
    this.FirstNameUpdate = response.FirstName;
    this.LastNameUpdate = response.LastName;
    this.UserName = response.UserName;
  },

  methods: {
    async UpdateUser() {
      var url = "https://slack.api.tristanmacelli.com/v1/users/me";
      let firstName = this.FirstNameUpdate;
      let lastName = this.LastNameUpdate;
      if (!firstName || !lastName) {
        alert("Error: Invalid name change, names must not be blank");
        return;
      }

      var body = {
        FirstName: firstName,
        LastName: lastName
      };
      let sessionToken = localStorage.getItem("auth");

      // send a get request with the above data
      let resp = await fetch(url, {
        method: "PATCH",
        headers: {
          Authorization: sessionToken,
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });
      if (!resp.ok) {
        let message = "Error: " + resp.status;
        alert(message);
      }
      // Since there are no errors and the fields are updated, there is no need to
      // make a request until the user returns to the page later
    }
  }
};
</script>

<style>
#userInfo {
  background-color: lightsteelblue;
  border-radius: 2px;
  width: 66vw;
  padding: 1em;
  margin: 0 3em;
}
</style>
