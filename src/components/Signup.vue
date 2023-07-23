<template>
  <div
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
      v-on:submit.prevent="SubmitForm"
      accept-charset="UTF-8"
      class="grid grid-flow-row gap-y-2 w-full p-3"
    >
      <div class="grid grid-flow-col gap-x-2">
        <input
          class="w-full p-2 bg-gray-100 border border-solid border-gray-300 focus:outline-none rounded-md"
          placeholder="First name"
          type="text"
          v-model="firstName"
        />
        <input
          class="w-full p-2 bg-gray-100 border border-solid border-gray-300 focus:outline-none rounded-md"
          placeholder="Last name"
          type="text"
          v-model="lastName"
        />
      </div>
      <input
        class="w-full p-2 bg-gray-100 border border-solid border-gray-300 focus:outline-none rounded-md"
        :class="
          !emailIsValid || emailIsDuplicate ? 'border-2 border-red-600' : ''
        "
        placeholder="Email"
        type="text"
        v-model="email"
        @focusin="checkEmailForDuplicates = false"
        @focusout="
          validateEmail = true;
          checkEmailForDuplicates = true;
        "
      />
      <p
        v-if="emailIsValid && emailIsDuplicate"
        class="text-red-600 text-sm font-medium"
      >
        This email is already in use
      </p>
      <p v-if="!emailIsValid" class="text-red-600 text-sm font-medium">
        Invalid email
      </p>
      <div class="w-full grid grid-flow-row">
        <label for="signUpPassword"
          >Password (6+ letters, at least 1 number, and 1 special
          character)</label
        >
        <input
          id="signUpPassword"
          class="p-2 bg-gray-100 border border-solid border-gray-300 focus:outline-none rounded-md"
          :class="
            !passwordsMatch || !passwordIsValid ? 'border-2 border-red-600' : ''
          "
          placeholder="New password"
          :type="showPasswordSignUp"
          v-model="password"
        />
      </div>
      <input
        class="w-full p-2 bg-gray-100 border border-solid border-gray-300 focus:outline-none rounded-md"
        :class="!passwordsMatch ? 'border-2 border-red-600' : ''"
        placeholder="Confirm password"
        :type="showPasswordSignUp"
        v-model="passwordConfirmation"
      />
      <div class="mb-4">
        <input
          type="checkbox"
          id="showPasswordSignUp"
          v-model="showPasswordSignUp"
          true-value="text"
          false-value="password"
          class="w-4 h-4"
        />
        <label for="showPasswordSignUp" class="ml-1.5 text-sm font-light"
          >Show Password</label
        >
      </div>
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
        :disabled="
          emailIsDuplicate ||
          !emailIsValid ||
          !passwordIsValid ||
          !passwordsMatch
        "
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
import { computed, ref, watch } from "vue";
import { useRouter } from "vue-router";
import { ValidateEmail, ValidateNewPassword } from "@/utils";

const emit = defineEmits(["hideModal"]);
const { SignUp, GetUserByEmail } = Users();
const router = useRouter();
// Form validation
const validateEmail = ref<boolean>(false);
const checkEmailForDuplicates = ref<boolean>(false);
const showPasswordSignUp = ref("password");
const emailIsDuplicate = ref<boolean>(false);

// Form input
const email = ref<string>("");
const password = ref<string>("");
const firstName = ref<string>("");
const lastName = ref<string>("");
const passwordConfirmation = ref<string>("");

// Check email for validity
const emailIsValid = computed(() => {
  if (email.value.length > 3 && validateEmail.value) {
    const valid = ValidateEmail(email.value);
    return valid;
  }
  return true;
});

// Check input email for duplicates
watch(checkEmailForDuplicates, async () => {
  if (
    !emailIsValid.value ||
    !checkEmailForDuplicates.value ||
    email.value.length <= 3
  ) {
    emailIsDuplicate.value = false;
    return;
  }
  const { foundUser } = await GetUserByEmail(email.value);
  emailIsDuplicate.value = !!foundUser;
});

// Check password for validity
const passwordIsValid = computed(() => {
  if (password.value.length >= 6) {
    return ValidateNewPassword(password.value);
  }
  return true;
});

// Ensure password and confirmation password match
const passwordsMatch = computed(() => {
  if (password.value.length >= 6 && passwordConfirmation.value.length >= 6) {
    return password.value === passwordConfirmation.value;
  }
  return true;
});

const SubmitForm = () => {
  SignUp(email.value, password.value, firstName.value, lastName.value);
};

const RouteToTerms = () => {
  let routeData = router.resolve({ path: "/legal/terms" });
  window.open(routeData.href, "_blank");
};
const HideSignUp = () => {
  emit("hideModal");
};
window.addEventListener("keydown", (e: KeyboardEvent) => {
  if (e.key === "Escape") HideSignUp();
});
</script>
