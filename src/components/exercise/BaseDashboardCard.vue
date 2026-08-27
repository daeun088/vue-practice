<script setup>
defineProps({
  title: { type: String, default: '' },
})
</script>

<template>
  <section class="dashboard-card">
    <h3 v-if="title" class="dashboard-card__title">{{ title }}</h3>
    <slot />
  </section>
</template>

<style scoped>
.dashboard-card {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 20px;
  margin-bottom: 20px;
}

.dashboard-card__title {
  font-size: 0.95rem;
  margin-bottom: 14px;
  text-align: center;
}
</style>
