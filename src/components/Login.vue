<template>
  <div
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
        placeholder="Email"
        type="text"
        v-model="email"
      />
      <input
        class="w-full p-2 border border-solid border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-400 shadow-inner rounded-md"
        placeholder="Password"
        type="password"
        v-model="password"
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
        class="w-48 mt-3 px-4 py-2 place-self-center bg-emerald-600 font-bold text-white cursor-pointer rounded-md"
        type="submit"
        value="Create New Account"
      />
    </form>
  </div>
</template>

<script>
import { Users } from "@/api/users";

export default {
  name: "loginComponent",
  setup(_, context) {
    const { email, password, SignIn } = Users();
    // Creating a new session based on the form values
    const Alert = () => {
      confirm("We're sorry but this feature is still under development :(");
    };
    const DisplaySignUp = () => {
      context.emit("displaySignup");
    };
    return {
      email,
      password,
      Alert,
      DisplaySignUp,
      SignIn,
    };
  },
  emits: ["displaySignup"],
};
</script>
