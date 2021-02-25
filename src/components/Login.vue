<template>
  <div
    v-once
    id="login"
    class="w-72 sm:w-96 h-66 sm:h-72 shadow-lg bg-white rounded-md p-4"
  >
    <form
      v-on:submit.prevent="SignIn"
      accept-charset="UTF-8"
      class="grid grid-rows-3 gap-y-2 w-full pb-2 border-b border-gray-300 border-solid"
    >
      <input
        class="w-full p-2 border border-solid border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-400 shadow-inner rounded-md"
        v-model="LogInEmail"
        type="text"
        placeholder="Email"
      />
      <input
        class="w-full p-2 border border-solid border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-400 shadow-inner rounded-md"
        v-model="LogInPass"
        type="password"
        placeholder="Password"
      />
      <input
        class="w-full px-16 py-2 bg-blue-500 font-bold text-white cursor-pointer rounded-md"
        type="submit"
        value="Log In"
      />
      <a
        href="/login/reset"
        class="justify-self-center w-32 my-2 text-sm text-center text-blue-500 hover:underline"
        @click.prevent="this.Alert"
        >Forgot Password?</a
      >
    </form>
    <form
      v-on:submit.prevent="this.DisplaySignUp"
      accept-charset="UTF-8"
      class="grid"
    >
      <input
        class="w-48 mt-6 px-4 py-2 place-self-center bg-green-600 font-bold text-white cursor-pointer rounded-md"
        type="submit"
        value="Create New Account"
      />
    </form>
  </div>
</template>

<script>
import axios from "axios";
import { mapState } from "vuex";

export default {
  name: "login",
  data() {
    return {
      LogInEmail: "",
      LogInPass: ""
    };
  },
  computed: mapState({
    groupID: state => state.group.id,
    serverURL: state => state.serverURL
  }),
  emits: ["displaySignup"],
  methods: {
    // Creating a new session based on the form values
    Alert() {
      confirm("We're sorry but this feature is still under development :(");
      this.$store.commit("setSignUpModal");
    },
    DisplaySignUp() {
      this.$emit("displaySignup");
    },
    async SignIn() {
      let url = this.serverURL + "v1/sessions";
      if (!this.LogInEmail || !this.LogInPass) {
        alert("Error: Invalid Credentials");
        return;
      }

      axios
        .post(url, {
          Email: this.LogInEmail,
          Password: this.LogInPass
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
  }
};
</script>
