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
              />
            </td>
            <td>
              <input
                id="account-lastname"
                type="text"
                v-model="LastNameUpdate"
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
import axios from "axios";
import { mapState } from "vuex";

export default {
  name: "user",
  data() {
    return {
      FirstNameUpdate: "",
      LastNameUpdate: "",
      UserName: ""
    };
  },
  computed: mapState(["serverURL"]),
  created: async function() {
    let url = this.serverURL + "v1/users/";
    let sessionToken = localStorage.getItem("auth");
    axios
      .get(url, {
        headers: {
          Authorization: sessionToken
        }
      })
      .catch(error => {
        console.log(error);
      })
      .then(response => {
        this.FirstNameUpdate = response.data.FirstName;
        this.LastNameUpdate = response.data.LastName;
        this.UserName = response.data.UserName;
      });
  },
  methods: {
    async UpdateUser() {
      var url = this.serverURL + "v1/users/me";
      let firstName = this.FirstNameUpdate;
      let lastName = this.LastNameUpdate;
      if (!this.FirstNameUpdate || !this.LastNameUpdate) {
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

#userBtn {
  border: 0;
  border-radius: 2px;
  padding: 0.3em 0.8em;
  box-shadow: inset 0 1px 1px gray;
}
</style>
