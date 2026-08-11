<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<style>
*,
*::before,
*::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  font-family: 'Inter', sans-serif;
}

ul,
ol {
  list-style: none;
}

a {
  text-decoration: none;
  color: inherit;
}

body {
  min-height: 100vh;
  background: #fff;
  color: #000;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  font-family: Helvetica, sans-serif;
}

img,
picture,
video,
canvas,
svg {
  display: block;
  max-width: 100%;
  height: auto;
}

input,
button,
textarea,
select {
  font: inherit;
  margin: 0;
  padding: 0;
  border: none;
  background: none;
  color: inherit;
  outline: none;
  box-shadow: none;
}

button {
  cursor: pointer;
  background: transparent;
  border: none;
}

table {
  border-collapse: collapse;
  border-spacing: 0;
}
</style>
