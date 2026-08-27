<script setup></script>

<template>
  <nav style="padding: 0 20px">
    <RouterLink to="/">홈</RouterLink>
    <RouterLink to="/weather/favorites">즐겨찾기</RouterLink>
    <RouterLink to="/weather/about">소개</RouterLink>
    <RouterLink to="/weather-mockup">Weather Mockup</RouterLink>
    <RouterLink to="/weather-composition">Weather Composition</RouterLink>
    <RouterLink to="/weather-dashboard">Weather Dashboard</RouterLink>
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
