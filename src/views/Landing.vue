<template>
  <div id="landing" class="main">
    <Signup @toggle-authentication="toggleAuth"></Signup>
  </div>
</template>

<script>
// @ is an alias to /src
import Signup from "@/components/Signup.vue";

export default {
  name: "Landing",
  props: {
    Socket: {
      type: Object,
      required: true
    }
  },
  components: {
    Signup
  }
};
</script>

<style>
#login {
  float: right;
  display: block;
  margin-left: 6em;
  margin-right: 6em;
  padding: 0.5em 0 0;
}

#login input {
  margin-right: 0.8em;
}

input[type="text"],
input[type="password"] {
  border-radius: 3px;
  border: 0;
  border-color: rgb(189, 199, 216);
  padding: 4px 4px;
}
</style>
