<script setup>
import { useConfigStore } from '../../stores/configStore'

const configStore = useConfigStore()
</script>

<template>
  <div class="unit-toggler">
    <button
      type="button"
      class="unit-btn"
      :class="{ active: !configStore.isFahrenheit }"
      @click="configStore.setUnit('celsius')"
    >
      °C
    </button>
    <button
      type="button"
      class="unit-btn"
      :class="{ active: configStore.isFahrenheit }"
      @click="configStore.setUnit('fahrenheit')"
    >
      °F
    </button>
  </div>
</template>

<style scoped>
.unit-toggler {
  display: inline-flex;
  border: 1px solid var(--color-border);
  border-radius: 999px;
  padding: 2px;
  gap: 2px;
}

.unit-btn {
  border: none;
  background: transparent;
  color: var(--color-text);
  border-radius: 999px;
  padding: 4px 12px;
  font-size: 0.85rem;
  cursor: pointer;
  opacity: 0.6;
  transition:
    background 0.15s ease,
    opacity 0.15s ease;
}

.unit-btn:hover {
  opacity: 1;
}

.unit-btn.active {
  background: #42b883;
  color: #fff;
  opacity: 1;
}
</style>
