<script setup>
import UnitToggler from './components/exercise/UnitToggler.vue'
</script>

<template>
  <div class="top-bar">
    <nav>
      <RouterLink to="/">홈</RouterLink>
      <RouterLink to="/weather/favorites">즐겨찾기</RouterLink>
      <RouterLink to="/weather/about">소개</RouterLink>
      <RouterLink to="/weather-mockup">Weather Mockup</RouterLink>
      <RouterLink to="/weather-composition">Weather Composition</RouterLink>
      <RouterLink to="/weather-dashboard">Weather Dashboard</RouterLink>
      <RouterLink to="/weather-vuetify">Weather Vuetify</RouterLink>
    </nav>
    <UnitToggler />
  </div>

  <RouterView />
</template>

<style scoped>
.top-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 0 20px 1rem;
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 1rem;
}

nav {
  display: flex;
  gap: 1rem;
  font-size: 1rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
  font-weight: bold;
}
</style>
