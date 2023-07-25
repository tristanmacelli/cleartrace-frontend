<template>
  <div
    id="login"
    class="w-72 sm:w-96 h-66 sm:h-76 shadow-lg bg-white rounded-md p-4"
  >
    <form
      v-on:submit.prevent="SubmitForm"
      accept-charset="UTF-8"
      class="grid grid-flow-row gap-y-1 w-full pb-2 border-b border-gray-300 border-solid"
    >
      <input
        class="w-full p-2 border border-solid border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-400 shadow-inner rounded-md"
        :class="validEmail && validCredentials ? '' : 'border-2 border-red-600'"
        placeholder="Email"
        type="text"
        v-model="email"
        @focusout="validateEmail = true"
      />
      <input
        class="w-full p-2 border border-solid border-gray-200 focus:outline-none focus:ring-1 focus:ring-blue-400 shadow-inner rounded-md"
        :class="validCredentials ? '' : 'border-2 border-red-600'"
        placeholder="Password"
        :type="showPassword"
        v-model="password"
      />
      <p v-if="!validCredentials" class="text-red-600 text-sm font-medium">
        Error: the email and/or password was incorrect
      </p>
      <div class="mb-4">
        <input
          type="checkbox"
          id="showPassword"
          v-model="showPassword"
          true-value="text"
          false-value="password"
          class="w-4 h-4"
        />
        <label for="showPassword" class="ml-1.5 text-sm font-light"
          >Show Password</label
        >
      </div>
      <input
        class="w-full px-16 py-2 bg-blue-500 font-bold text-white cursor-pointer rounded-md"
        type="submit"
        :disabled="!validEmail || password.length === 0"
        value="Log In"
      />
      <a
        href="/login/reset"
        class="justify-self-center w-32 my-2 text-sm text-center text-blue-500 hover:underline"
        @click.prevent="Alert"
        >Forgot Password?</a
      >
    </form>
    <form
      v-on:submit.prevent="DisplaySignUp"
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

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "loginComponent",
});
</script>

<script lang="ts" setup>
import { Users } from "@/api/users";
import { ValidateEmail } from "@/utils";
import { computed, ref } from "vue";

const emit = defineEmits(["displaySignup"]);
const { SignIn } = Users();
const email = ref<string>("");
const password = ref<string>("");

const showPassword = ref<string>("password");
const validateEmail = ref<boolean>(false);
const validCredentials = ref<boolean>(true);

const validEmail = computed(() => {
  if (email.value.length > 10 && validateEmail.value) {
    return ValidateEmail(email.value);
  }
  return true;
});

const SubmitForm = async () => {
  const { error } = await SignIn(email.value, password.value);
  if (error) {
    validCredentials.value = false;
  }
};

// Creating a new session based on the form values
const Alert = () => {
  confirm("We're sorry but this feature is still under development :(");
};
const DisplaySignUp = () => {
  emit("displaySignup");
};
</script>
