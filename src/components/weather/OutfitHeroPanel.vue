<script setup>
defineProps({
  city: { type: Object, default: null },
  outfit: { type: Object, default: null },
  needsUmbrella: { type: Boolean, default: false },
})
</script>

<template>
  <div class="outfit-hero" v-if="city">
    <div class="hero-emoji">{{ outfit.emoji }}</div>
    <div class="hero-body">
      <p class="hero-city">{{ city.name }} · {{ city.temp }}°C · {{ city.status }}</p>
      <p class="hero-outfit">
        오늘의 코디 추천: <strong>{{ outfit.label }}</strong>
      </p>
      <p class="hero-umbrella" v-if="needsUmbrella">비 소식이 있어요, 우산도 챙기세요!</p>
    </div>
  </div>
  <div class="outfit-hero outfit-hero--placeholder" v-else>
    도시 카드를 누르면 오늘의 코디를 추천해드려요
  </div>
</template>

<style scoped>
.outfit-hero {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 22px;
  margin-bottom: 20px;
  border-radius: 16px;
  background: linear-gradient(135deg, #6fb1fc, #4a7fe0);
  color: #fff;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
}

.outfit-hero--placeholder {
  justify-content: center;
  text-align: center;
  background: var(--color-background-soft);
  color: var(--color-text);
  border: 1px dashed var(--color-border);
  box-shadow: none;
}

.hero-emoji {
  font-size: 2.5rem;
  line-height: 1;
}

.hero-city {
  font-size: 0.85rem;
  margin-bottom: 4px;
}

.hero-outfit {
  font-size: 1.1rem;
}

.hero-umbrella {
  margin-top: 6px;
  font-size: 0.9rem;
}
</style>
