<template>
  <div v-once class="sm:h-72 lg:h-auto">
    <h1 class="font-bold text-3xl lg:text-5xl text-center md:text-left">
      Cleartrace
    </h1>
    <p>Simply private messaging.</p>
    <img
      src="../assets/msgs-lg.png"
      alt="A back-and-forth conversation in message bubbles"
      class="hidden sm:block sm:w-96"
    />
  </div>
</template>

<script>
export default {
  name: "titleSplash"
};
</script>
