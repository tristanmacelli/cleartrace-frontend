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
                {{ user.name }}
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
              <input id="account-firstname" type="text" v-model="firstName" />
            </td>
            <td>
              <input id="account-lastname" type="text" v-model="lastName" />
            </td>
            <td><input type="submit" id="userBtn" value="CHANGE" /></td>
          </tr>
        </tbody>
      </table>
    </form>
  </div>
</template>

<script>
import { Users } from "@/api/users";
export default {
  name: "userComponent",
  setup() {
    const { firstName, lastName, user } = Users();
    return {
      firstName,
      lastName,
      user,
    };
  },
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
