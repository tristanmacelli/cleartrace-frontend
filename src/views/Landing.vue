<template>
  <div
    id="landing"
    class="w-screen h-screen bg bg-cover flex flex-col sm:flex-row sm:flex-nowrap 
           gap-y-2 md:space-y-0 lg:grid-cols-2 sm:gap-x-4 lg:gap-x-40 items-center justify-center"
  >
    <Title></Title>
    <Login @display-signup="DisplaySignUp"></Login>
    <Signup v-if="displaySignUp" @hide-signup="HideSignUp"></Signup>
  </div>
</template>

<script>
// @ is an alias to /src
import Title from "@/components/Title.vue";
import Login from "@/components/Login.vue";
import Signup from "@/components/Signup.vue";
import { ref } from "vue";

export default {
  name: "Landing",
  components: {
    Title,
    Login,
    Signup
  },
  setup() {
    const displaySignUp = ref(false);

    const DisplaySignUp = () => {
      this.displaySignUp = true;
    };
    const HideSignUp = () => {
      this.displaySignUp = false;
    };

    return {
      displaySignUp,
      DisplaySignUp,
      HideSignUp
    };
  }
};
</script>

<style scoped>
.bg {
  background: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIj48ZGVmcz48cGF0dGVybiBpZD0icGF0dGVybiIgd2lkdGg9IjI5IiBoZWlnaHQ9IjI5IiB2aWV3Qm94PSIwIDAgNDAsNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgwKSAiPjxyZWN0IGlkPSJwYXR0ZXJuLWJhY2tncm91bmQiIHdpZHRoPSI0MDAlIiBoZWlnaHQ9IjQwMCUiIGZpbGw9InJnYmEoMjM3LCAyNDIsIDI0NywxKSI+PC9yZWN0PiA8Y2lyY2xlIGZpbGw9InJnYmEoMjYsIDMyLCA0NCwxKSIgY3g9IjQwIiBjeT0iMjAiIHI9IjAuMjUiPjwvY2lyY2xlPjxjaXJjbGUgZmlsbD0icmdiYSgyNiwgMzIsIDQ0LDEpIiBjeD0iMCIgY3k9IjIwIiByPSIwLjI1Ij48L2NpcmNsZT48Y2lyY2xlIGZpbGw9InJnYmEoMjYsIDMyLCA0NCwxKSIgY3g9IjIwIiBjeT0iMjAiIHI9IjAuMjUiPjwvY2lyY2xlPjxjaXJjbGUgZmlsbD0icmdiYSgyNiwgMzIsIDQ0LDEpIiBjeD0iMCIgY3k9IjIwIiByPSIxIj48L2NpcmNsZT48Y2lyY2xlIGZpbGw9InJnYmEoMjYsIDMyLCA0NCwxKSIgY3g9IjQwIiBjeT0iMjAiIHI9IjEiPjwvY2lyY2xlPjwvcGF0dGVybj4gIDwvZGVmcz4gPHJlY3QgZmlsbD0idXJsKCNwYXR0ZXJuKSIgaGVpZ2h0PSIxMDAlIiB3aWR0aD0iMTAwJSI+PC9yZWN0Pjwvc3ZnPg==");
}
</style>
