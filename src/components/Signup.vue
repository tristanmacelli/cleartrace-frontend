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
        @click="HideSignUp"
        class="p-2 h-8 cursor-pointer hover:bg-gray-200 focus:bg-gray-300 focus:outline-none rounded-3xl"
      >
        <img src="../assets/black-x.svg" width="16" alt="a black x icon" />
      </button>
    </div>
    <form
      v-on:submit.prevent="SignUp"
      accept-charset="UTF-8"
      class="grid grid-rows-5 gap-y-2 w-full p-3"
    >
      <div class="h-4 gap-x-2">
        <input
          class="w-1/2 p-2 bg-gray-100 border border-solid border-gray-300 focus:outline-none rounded-md"
          placeholder="First name"
          type="text"
          v-model="firstName"
        />
        <input
          class="w-1/2 p-2 bg-gray-100 border border-solid border-gray-300 focus:outline-none rounded-md"
          placeholder="Last name"
          type="text"
          v-model="lastName"
        />
      </div>
      <input
        class="w-full p-2 bg-gray-100 border border-solid border-gray-300 focus:outline-none rounded-md"
        placeholder="Email"
        type="text"
        v-model="email"
      />
      <input
        class="w-full p-2 bg-gray-100 border border-solid border-gray-300 focus:outline-none rounded-md"
        placeholder="New password"
        type="password"
        v-model="password"
      />
      <div>
        <p class="text-xs">
          By clicking Sign Up, you agree to our
          <a
            @click.prevent="RouteToTerms"
            class="text-blue-500 hover:underline cursor-pointer"
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
  <div
    @click.prevent="$emit('hideModal')"
    class="absolute w-screen h-screen z-40 opacity-80 bg-gray-300"
  ></div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "signupComponent",
});
</script>

<script lang="ts" setup>
import { Users } from "@/api/users";
import { useRouter } from "vue-router";

const emit = defineEmits(["hideModal"]);
const { email, password, firstName, lastName, SignUp } = Users();
const router = useRouter();

const RouteToTerms = () => {
  let routeData = router.resolve({ path: "/legal/terms" });
  window.open(routeData.href, "_blank");
};
const HideSignUp = () => {
  emit("hideModal");
};
</script>
