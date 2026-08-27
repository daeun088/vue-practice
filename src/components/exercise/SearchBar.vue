<script setup>
defineProps({
  searchQuery: { type: String, required: true },
})

const emit = defineEmits(['update-query'])

const handleInput = (event) => {
  emit('update-query', event.target.value)
}

const handleClear = () => {
  emit('update-query', '')
}
</script>

<template>
  <div class="search-box">
    <span class="search-icon">🔍</span>
    <input
      type="text"
      :value="searchQuery"
      @input="handleInput"
      @keyup.esc="handleClear"
      placeholder="도시 이름 검색하세요"
    />
  </div>
  <p class="search-echo" v-if="searchQuery">
    <span class="dot"></span>입력한 도시명: <strong>{{ searchQuery }}</strong>
  </p>
</template>

<style scoped>
.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 420px;
  margin: 0 auto;
  padding: 10px 16px;
  border-radius: 999px;
  background: var(--color-background);
  border: 1px solid var(--color-border);
}

.search-box input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 0.95rem;
  color: var(--color-text);
}

.search-echo {
  text-align: center;
  font-size: 0.85rem;
  opacity: 0.85;
  margin-top: 10px;
}

.search-echo .dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #ff6a3d;
  margin-right: 6px;
}
</style>
