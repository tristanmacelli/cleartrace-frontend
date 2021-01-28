<template>
  <div
    id="landing"
    class="
      main grid sm:grid-rows-1 space-y-10 lg:space-y-0 lg:grid-rows-none 
      lg:grid-cols-2 lg:mx-20 xl:mx-60 2xl:mx-80 justify-items-center content-center"
  >
    <Signup></Signup>
    <Login></Login>
  </div>
</template>

<script>
// @ is an alias to /src
import Signup from "@/components/Signup.vue";
import Login from "@/components/Login.vue";

export default {
  name: "Landing",
  components: {
    Signup,
    Login
  }
};
</script>
