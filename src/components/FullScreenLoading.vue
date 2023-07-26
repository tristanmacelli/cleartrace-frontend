<template id="full-screen-loading">
  <div class="h-screen w-screen grid absolute top-0 left-0 bg-img">
    <div class="w-fit grid gap-y-2 place-self-center">
      <img
        src="../assets/loading-spinner.svg"
        class="justify-self-center h-12 w-12"
        width="48"
        height="48"
      />
      <p>Loading Conversations</p>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "FullScreenLoading",
});
</script>

<style scoped>
.bg-img {
  background: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIj48ZGVmcz48cGF0dGVybiBpZD0icGF0dGVybiIgd2lkdGg9IjI5IiBoZWlnaHQ9IjI5IiB2aWV3Qm94PSIwIDAgNDAsNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgwKSAiPjxyZWN0IGlkPSJwYXR0ZXJuLWJhY2tncm91bmQiIHdpZHRoPSI0MDAlIiBoZWlnaHQ9IjQwMCUiIGZpbGw9InJnYmEoMjM3LCAyNDIsIDI0NywxKSI+PC9yZWN0PiA8Y2lyY2xlIGZpbGw9InJnYmEoMjYsIDMyLCA0NCwxKSIgY3g9IjQwIiBjeT0iMjAiIHI9IjAuMjUiPjwvY2lyY2xlPjxjaXJjbGUgZmlsbD0icmdiYSgyNiwgMzIsIDQ0LDEpIiBjeD0iMCIgY3k9IjIwIiByPSIwLjI1Ij48L2NpcmNsZT48Y2lyY2xlIGZpbGw9InJnYmEoMjYsIDMyLCA0NCwxKSIgY3g9IjIwIiBjeT0iMjAiIHI9IjAuMjUiPjwvY2lyY2xlPjxjaXJjbGUgZmlsbD0icmdiYSgyNiwgMzIsIDQ0LDEpIiBjeD0iMCIgY3k9IjIwIiByPSIxIj48L2NpcmNsZT48Y2lyY2xlIGZpbGw9InJnYmEoMjYsIDMyLCA0NCwxKSIgY3g9IjQwIiBjeT0iMjAiIHI9IjEiPjwvY2lyY2xlPjwvcGF0dGVybj4gIDwvZGVmcz4gPHJlY3QgZmlsbD0idXJsKCNwYXR0ZXJuKSIgaGVpZ2h0PSIxMDAlIiB3aWR0aD0iMTAwJSI+PC9yZWN0Pjwvc3ZnPg==");
}
</style>
