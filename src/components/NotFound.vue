<template>
  <div class="h-screen w-screen grid bg-img">
    <h1
      class="justify-self-center self-center text-2xl text-center px-10 py-6 bg-slate-100 shadow-md rounded-md"
    >
      <p class="text-red-600 font-bold">Error 404</p>
      Page Not Found
    </h1>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "NotFound",
});
</script>

<style scoped>
.bg-img {
  background: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIj48ZGVmcz48cGF0dGVybiBpZD0icGF0dGVybiIgd2lkdGg9IjI5IiBoZWlnaHQ9IjI5IiB2aWV3Qm94PSIwIDAgNDAsNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgwKSAiPjxyZWN0IGlkPSJwYXR0ZXJuLWJhY2tncm91bmQiIHdpZHRoPSI0MDAlIiBoZWlnaHQ9IjQwMCUiIGZpbGw9InJnYmEoMjM3LCAyNDIsIDI0NywxKSI+PC9yZWN0PiA8Y2lyY2xlIGZpbGw9InJnYmEoMjYsIDMyLCA0NCwxKSIgY3g9IjQwIiBjeT0iMjAiIHI9IjAuMjUiPjwvY2lyY2xlPjxjaXJjbGUgZmlsbD0icmdiYSgyNiwgMzIsIDQ0LDEpIiBjeD0iMCIgY3k9IjIwIiByPSIwLjI1Ij48L2NpcmNsZT48Y2lyY2xlIGZpbGw9InJnYmEoMjYsIDMyLCA0NCwxKSIgY3g9IjIwIiBjeT0iMjAiIHI9IjAuMjUiPjwvY2lyY2xlPjxjaXJjbGUgZmlsbD0icmdiYSgyNiwgMzIsIDQ0LDEpIiBjeD0iMCIgY3k9IjIwIiByPSIxIj48L2NpcmNsZT48Y2lyY2xlIGZpbGw9InJnYmEoMjYsIDMyLCA0NCwxKSIgY3g9IjQwIiBjeT0iMjAiIHI9IjEiPjwvY2lyY2xlPjwvcGF0dGVybj4gIDwvZGVmcz4gPHJlY3QgZmlsbD0idXJsKCNwYXR0ZXJuKSIgaGVpZ2h0PSIxMDAlIiB3aWR0aD0iMTAwJSI+PC9yZWN0Pjwvc3ZnPg==");
}
</style>
