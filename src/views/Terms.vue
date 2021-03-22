<template>
  <div class="w-screen h-screen flex flex-col bg-img py-12">
    <div class="max-w-screen-xl mx-auto px-16 flex-grow bg-gray-100">
      <header class="flex flex-col py-12">
        <h2 class="text-black text-left text-3xl font-bold">
          Terms of Service
        </h2>
        <p class="w-96 text-gray-500 italic">
          Effective on March 22, 2021
        </p>
      </header>
      <body class="">
        <section>
          <h3 class="text-xl font-bold text-gray-800">1. Privacy Policy</h3>
          <p class="text-gray-700 my-2">
            a) We do not sell any of your information now, nor will we ever opt
            to sell sell your information in the future. We want to foster an
            environment provides maximum privacy and we are committed to
            upholding this promise no matter the circumstances. There are,
            however some trade-offs made to achieve this level privacy so that
            there is a reasonable amount of expected behavior and convenience
            built-in.
          </p>
          <p class="text-gray-700">
            b) If you opt to not save messages, we will never save any of your
            messages on our servers. Besides the information you provided when
            signing up (Firstname, lastname, email, and password) nothing else
            will be saved on our servers.
          </p>
        </section>
        <section class="my-2">
          <h3 class="text-xl font-bold text-gray-800">
            2. Contribute to These Terms
          </h3>
          <p class="text-gray-700">
            These terms are a work-in-progress (WIP). If anything you read here
            is unclear, please reach out to us for clarification.
          </p>
        </section>
      </body>
    </div>
    <div class="max-w-screen-xl mx-auto px-4 bg-gray-100">
      <footer class="flex flex-col">
        <p class="pb-4 self-center">
          &#169; 2021 {{ serviceName }}. Built with
          <a
            class="underline text-gray-500 hover:text-gray-600"
            href="http://vuejs.org/"
          >
            Vue</a> &amp;
          <a
            class="underline text-gray-500 hover:text-gray-600"
            href="https://tailwindcss.com/"
          >
            TailwindCSS</a
          >.
        </p>
      </footer>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "Terms",
  setup() {
    let serviceName = "Cleartrace";
    return { serviceName };
  }
});
</script>

<style scoped>
.bg-img {
  background: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIiB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIj48ZGVmcz48cGF0dGVybiBpZD0icGF0dGVybiIgd2lkdGg9IjI5IiBoZWlnaHQ9IjI5IiB2aWV3Qm94PSIwIDAgNDAsNDAiIHBhdHRlcm5Vbml0cz0idXNlclNwYWNlT25Vc2UiIHBhdHRlcm5UcmFuc2Zvcm09InJvdGF0ZSgwKSAiPjxyZWN0IGlkPSJwYXR0ZXJuLWJhY2tncm91bmQiIHdpZHRoPSI0MDAlIiBoZWlnaHQ9IjQwMCUiIGZpbGw9InJnYmEoMjM3LCAyNDIsIDI0NywxKSI+PC9yZWN0PiA8Y2lyY2xlIGZpbGw9InJnYmEoMjYsIDMyLCA0NCwxKSIgY3g9IjQwIiBjeT0iMjAiIHI9IjAuMjUiPjwvY2lyY2xlPjxjaXJjbGUgZmlsbD0icmdiYSgyNiwgMzIsIDQ0LDEpIiBjeD0iMCIgY3k9IjIwIiByPSIwLjI1Ij48L2NpcmNsZT48Y2lyY2xlIGZpbGw9InJnYmEoMjYsIDMyLCA0NCwxKSIgY3g9IjIwIiBjeT0iMjAiIHI9IjAuMjUiPjwvY2lyY2xlPjxjaXJjbGUgZmlsbD0icmdiYSgyNiwgMzIsIDQ0LDEpIiBjeD0iMCIgY3k9IjIwIiByPSIxIj48L2NpcmNsZT48Y2lyY2xlIGZpbGw9InJnYmEoMjYsIDMyLCA0NCwxKSIgY3g9IjQwIiBjeT0iMjAiIHI9IjEiPjwvY2lyY2xlPjwvcGF0dGVybj4gIDwvZGVmcz4gPHJlY3QgZmlsbD0idXJsKCNwYXR0ZXJuKSIgaGVpZ2h0PSIxMDAlIiB3aWR0aD0iMTAwJSI+PC9yZWN0Pjwvc3ZnPg==");
}
</style>
