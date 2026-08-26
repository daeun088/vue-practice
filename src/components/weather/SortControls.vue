<script setup>
defineProps({
  sortOrder: { type: String, required: true },
})

defineEmits(['update-sort'])

const options = [
  { value: 'default', label: '기본순' },
  { value: 'asc', label: '온도 낮은순' },
  { value: 'desc', label: '온도 높은순' },
]
</script>

<template>
  <div class="sort-controls">
    <span class="sort-label">정렬</span>
    <button
      v-for="option in options"
      :key="option.value"
      class="sort-btn"
      :class="{ active: sortOrder === option.value }"
      @click="$emit('update-sort', option.value)"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<style scoped>
.sort-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-wrap: wrap;
  margin-top: 14px;
}

.sort-label {
  font-size: 0.85rem;
  opacity: 0.6;
}

.sort-btn {
  border: 1px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text);
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 0.85rem;
  cursor: pointer;
}

.sort-btn:hover {
  border-color: #42b883;
}

.sort-btn.active {
  background: #42b883;
  border-color: #42b883;
  color: #fff;
}
</style>
