<script setup>
import UnitToggler from './components/exercise/UnitToggler.vue'
</script>

<template>
  <header class="top-bar">
    <RouterLink to="/" class="brand">
      <span class="brand-mark">🧥</span>
      <span class="brand-name">오늘뭐입지</span>
    </RouterLink>

    <nav>
      <RouterLink to="/">홈</RouterLink>
      <RouterLink to="/weather/favorites">즐겨찾기</RouterLink>
      <RouterLink to="/weather/about">소개</RouterLink>
      <RouterLink to="/archive">기록</RouterLink>
    </nav>

    <UnitToggler />
  </header>

  <RouterView />
</template>

<style scoped>
.top-bar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 0.75rem 20px;
  background: var(--color-background);
  border-bottom: 1px solid var(--color-border);
  margin-bottom: 1rem;
}

.brand {
  display: flex;
  align-items: center;
  gap: 6px;
  text-decoration: none;
  margin-right: auto;
}

.brand-mark {
  font-size: 1.4rem;
}

.brand-name {
  font-size: 1.2rem;
  font-weight: 800;
  background: linear-gradient(120deg, #ff8a5c, #ff5e8e);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

nav {
  display: flex;
  gap: 4px;
  font-size: 0.9rem;
}

nav a {
  padding: 6px 14px;
  border-radius: 999px;
  color: var(--color-text);
  text-decoration: none;
  opacity: 0.7;
  transition:
    background 0.15s ease,
    opacity 0.15s ease;
}

nav a:hover {
  background: var(--color-background-mute);
  opacity: 1;
}

nav a.router-link-exact-active {
  background: linear-gradient(120deg, #ff8a5c, #ff5e8e);
  color: #fff;
  opacity: 1;
  font-weight: 600;
}
</style>
