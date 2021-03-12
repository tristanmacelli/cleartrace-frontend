<template>
  <div
    v-once
    id="signup"
    class="absolute z-50 sm:block w-80 sm:w-max h-88 rounded-md shadow-xl bg-white"
  >
    <div class="flex no-wrap p-3 border-b border-gray-300">
      <div class="flex-grow">
        <p class="text-2xl font-bold">Create an Account</p>
        <p>It's easy!</p>
      </div>
      <button
        @click="this.HideSignUp"
        class="p-2 h-8 cursor-pointer hover:bg-gray-200 rounded-3xl"
      >
        <svg class="w-4" viewBox="0 0 96 96" enable-background="new 0 0 96 96">
          <polygon
            fill="black"
            points="96,14 82,0 48,34 14,0 0,14 34,48 0,82 14,96 48,62 82,96 96,82 62,48 "
          />
        </svg>
      </button>
    </div>
    <form
      v-on:submit.prevent="SignUp"
      accept-charset="UTF-8"
      class="grid grid-rows-5 gap-y-2 w-full p-3"
    >
      <div class="h-4 gap-x-2">
        <input
          type="text"
          class="w-1/2 p-2 bg-gray-100 border border-solid border-gray-300 focus:outline-none rounded-md"
          v-model="firstName"
          id="firstname"
          placeholder="First name"
        />
        <input
          type="text"
          class="w-1/2 p-2 bg-gray-100 border border-solid border-gray-300 focus:outline-none rounded-md"
          v-model="lastName"
          id="lastname"
          placeholder="Last name"
        />
      </div>
      <input
        type="text"
        class="w-full p-2 bg-gray-100 border border-solid border-gray-300 focus:outline-none rounded-md"
        v-model="email"
        id="email"
        placeholder="Email"
      />
      <input
        type="password"
        class="w-full p-2 bg-gray-100 border border-solid border-gray-300 focus:outline-none rounded-md"
        v-model="password"
        id="pass"
        placeholder="New password"
      />
      <div>
        <p class="text-xs">
          By clicking Sign Up, you agree to our
          <a
            href="/legal/terms"
            @click.prevent="this.Alert"
            class="text-blue-500 hover:underline"
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
  <div class="absolute w-screen h-screen z-40 opacity-80 bg-gray-300"></div>
</template>

<script>
import { Users } from "@/api/users";

export default {
  name: "signup",
  setup(_, context) {
    const { email, password, firstName, lastName, SignUp } = Users();
    const Alert = () => {
      confirm("We're sorry but this feature is still under development :(");
    };
    const HideSignUp = () => {
      context.emit("hideSignup");
    };
    return {
      email,
      password,
      firstName,
      lastName,
      Alert,
      HideSignUp,
      SignUp
    };
  },
  emits: ["hideSignup"]
};
</script>
