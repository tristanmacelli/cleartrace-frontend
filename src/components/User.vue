<template>
  <div id="userInfo">
    <form
      id="createuser"
      v-on:submit.prevent="UpdateUser(firstName, lastName)"
      accept-charset="UTF-8"
    >
      <table cellspacing="0" role="presentation">
        <tbody>
          <tr>
            <td><p>Username:</p></td>
            <td>
              <p v-if="user" id="account-username">
                {{ user.firstName + " " + user.lastName }}
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

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "userComponent",
});
</script>

<script lang="ts" setup>
import { ref } from "vue";
import { storeToRefs } from "pinia";
import { Users } from "@/api/users";
import usePiniaStore from "@/store/pinia";

const pinia = usePiniaStore();
const { user } = storeToRefs(pinia);
const { UpdateUser } = Users();
const firstName = ref<string>(user.value?.firstName || "");
const lastName = ref<string>(user.value?.lastName || "");
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
