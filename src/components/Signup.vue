<template>
  <div
    id="signup"
    class="sm:block w-80 sm:w-max h-88 p-3 rounded-md shadow-lg bg-white"
  >
    <p class="text-2xl font-bold">Create an Account</p>
    <p>It's easy!</p>
    <form
      v-on:submit.prevent="SignUp"
      accept-charset="UTF-8"
      class="grid grid-rows-5 gap-y-2 w-full"
    >
      <div class="h-4 gap-x-2">
        <input
          type="text"
          class="w-1/2 p-2 bg-gray-100 border border-solid border-gray-300 focus:outline-none rounded-md"
          v-model="NewFirstName"
          id="firstname"
          placeholder="First name"
        />
        <input
          type="text"
          class="w-1/2 p-2 bg-gray-100 border border-solid border-gray-300 focus:outline-none rounded-md"
          v-model="NewLastName"
          id="lastname"
          placeholder="Last name"
        />
      </div>
      <input
        type="text"
        class="w-full p-2 bg-gray-100 border border-solid border-gray-300 focus:outline-none rounded-md"
        v-model="NewEmail"
        id="email"
        placeholder="Email"
      />
      <input
        type="password"
        class="w-full p-2 bg-gray-100 border border-solid border-gray-300 focus:outline-none rounded-md"
        v-model="NewPassword"
        id="pass"
        placeholder="New password"
      />
      <div>
        <p class="text-xs">
          By clicking Sign Up, you agree to our
          <a href="/legal/terms" class="text-blue-500 hover:underline"
            >Terms of Service</a
          >.
        </p>
      </div>
      <input
        type="submit"
        class="w-48 py-1 place-self-center bg-green-600 font-bold text-white rounded-md cursor-pointer"
        id="newUserBtn"
        value="Sign Up"
      />
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
      let url = "https://slack.api.tristanmacelli.com/v1/users";
      let username = this.NewFirstName + "." + this.NewLastName;

      if (!this.NewEmail || !this.NewPassword) {
        alert("Error: Invalid New User Input");
        return;
      }

      let body = {
        Email: this.NewEmail,
        Password: this.NewPassword,
        PasswordConf: this.NewPassword,
        UserName: username,
        FirstName: this.NewFirstName,
        LastName: this.NewLastName
      };

      let resp = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
      });
      if (!resp.ok) {
        let message = "Error: " + resp.status.toString();
        alert(message);
      }

      let hasAuth = resp.headers.get("authorization");
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
