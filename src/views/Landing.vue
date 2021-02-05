<template>
  <div
    id="landing"
    class="w-screen h-screen bg-cover flex flex-col sm:flex-row sm:flex-nowrap 
           gap-y-2 md:space-y-0 lg:grid-cols-2 sm:gap-x-4 lg:gap-x-40 items-center justify-center"
  >
    <Title></Title>
    <Login @display-signup="this.DisplaySignUp"></Login>
    <Signup v-if="this.displaySignUp" @hide-signup="this.HideSignUp"></Signup>
  </div>
</template>

<script>
// @ is an alias to /src
import Title from "@/components/Title.vue";
import Login from "@/components/Login.vue";
import Signup from "@/components/Signup.vue";

export default {
  name: "Landing",
  components: {
    Title,
    Login,
    Signup
  },
  data() {
    return {
      displaySignUp: false
    };
  },
  methods: {
    DisplaySignUp() {
      this.displaySignUp = true;
    },
    HideSignUp() {
      this.displaySignUp = false;
    }
  }
};
</script>
