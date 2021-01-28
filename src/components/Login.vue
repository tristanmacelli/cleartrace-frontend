<template>
  <div
    id="login"
    class="w-72 sm:w-96 sm:h-72 shadow-lg bg-white rounded-md p-4"
  >
    <form
      v-on:submit.prevent="SignIn"
      accept-charset="UTF-8"
      class="grid grid-rows-3 gap-y-2 w-full"
    >
      <input
        class="w-full p-2 border border-solid border-gray-200 focus:ring-1 focus:ring-blue-400 shadow-inner rounded-md"
        v-model="LogInEmail"
        type="text"
        placeholder="Email"
      />
      <input
        class="w-full p-2 border border-solid border-gray-200 focus:ring-1 focus:ring-blue-400 shadow-inner rounded-md"
        v-model="LogInPass"
        type="password"
        placeholder="Password"
      />
      <input
        class="w-full px-16 py-2 bg-blue-500 font-bold text-white cursor-pointer rounded-md"
        type="submit"
        value="Log In"
      />
    </form>
    <form
      v-on:submit.prevent="testHelloAlert"
      accept-charset="UTF-8"
      class="grid"
    >
      <input
        class="w-48 mt-8 px-4 py-2 place-self-center bg-green-600 font-bold text-white cursor-pointer rounded-md"
        type="submit"
        value="Create New Account"
      />
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
    testHelloAlert() {
      confirm("Your interaction was successful!");
      this.$store.commit("setSignUpModal");
    },
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
