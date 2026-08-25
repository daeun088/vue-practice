<script setup></script>

<template>
  <nav style="padding: 0 20px">
    <RouterLink to="/weather">Weather Mockup</RouterLink>
    <RouterLink to="/weather-composition">Weather Composition</RouterLink>
  </nav>

  <RouterView />
</template>

<style scoped>
nav {
  display: flex;
  gap: 1rem;
  font-size: 1rem;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 1rem;
  margin-bottom: 1rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
  font-weight: bold;
}
</style>
