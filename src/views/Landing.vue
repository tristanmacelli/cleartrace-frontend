<template>
  <div
    id="landing"
    class="
      h-screen bg-cover grid sm:grid-rows-1 gap-y-2 md:space-y-0 lg:grid-rows-none 
      lg:grid-cols-2 lg:mx-20 xl:mx-66 2xl:mx-80 justify-items-center content-center"
  >
    <Title></Title>
    <Login></Login>
  </div>
</template>

<script>
// @ is an alias to /src
import Title from "@/components/Title.vue";
import Login from "@/components/Login.vue";

export default {
  name: "Landing",
  components: {
    Title,
    Login
  }
};
</script>
