<template>
  <div id="logout">
    <button @click="LogOut" class="pull-right">Log Out</button>
  </div>
</template>

<script>
export default {
  name: "logOut"
};
</script>

<style scoped>
.pull-right {
  float: right;
  display: block;
  margin-left: 6em;
  margin-right: 6em;
  padding: 1.5em 0;
}

h1 {
  font-family: "Open Sans", sans-serif;
}

nav ul {
  margin: 0;
  padding: 0;
  list-style: none;
}

nav li {
  display: inline-block;

  position: relative;
}

nav a {
  color: White;
  text-decoration: none;
  text-transform: uppercase;
  font-size: 1.5em;
}

nav a:visited {
  color: white;
  text-decoration: none;
  font-size: 1.5em;
}

nav a:hover {
  background-color: #305f99;
  text-decoration: none;
}
</style>
