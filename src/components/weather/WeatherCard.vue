<script setup>
import { computed } from 'vue'
import { getOutfitCategory } from './outfit'

const props = defineProps({
  city: { type: Object, required: true },
  isSelected: { type: Boolean, default: false },
  isFavorite: { type: Boolean, default: false },
  isFahrenheit: { type: Boolean, default: false },
})

defineEmits(['select-card', 'click-detail', 'toggle-favorite', 'toggle-temp-unit', 'context-menu'])

const weatherIcons = {
  맑음: '☀️',
  비: '🌧️',
  구름: '☁️',
}

const outfit = computed(() => getOutfitCategory(props.city.temp))
const displayTemp = computed(() =>
  props.isFahrenheit ? Math.round((props.city.temp * 9) / 5 + 32) : props.city.temp,
)
</script>

<template>
  <div
    class="weather-card"
    :class="{ 'is-hot': city.temp >= 25, 'is-selected': isSelected }"
    @click="$emit('select-card', city)"
    @contextmenu.prevent="$emit('context-menu', city)"
  >
    <button
      class="favorite-star"
      :class="{ 'is-favorite': isFavorite }"
      @click.stop="$emit('toggle-favorite', city)"
    >
      {{ isFavorite ? '⭐' : '☆' }}
    </button>
    <div class="card-icon">{{ weatherIcons[city.status] ?? '🌈' }}</div>
    <h3 class="city-name">{{ city.name }}</h3>
    <p
      class="temp"
      @click.stop
      @dblclick.stop="$emit('toggle-temp-unit', city)"
      title="더블클릭: °C/°F 전환"
    >
      {{ displayTemp }}<span class="deg">{{ isFahrenheit ? '°F' : '°C' }}</span>
    </p>
    <p class="status-text">{{ city.status }}</p>

    <p class="badge">{{ outfit.emoji }} {{ outfit.label }}</p>

    <button class="detail-btn" @click.stop="$emit('click-detail', city)">상세보기</button>
  </div>
</template>

<style scoped>
.weather-card {
  position: relative;
  padding: 20px 16px;
  border-radius: 16px;
  text-align: center;
  cursor: pointer;
  background: linear-gradient(160deg, #6fb1fc, #4a7fe0);
  color: #fff;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
  transition:
    transform 0.18s ease,
    box-shadow 0.18s ease;
}

.weather-card.is-hot {
  background: linear-gradient(160deg, #ff9a56, #ff6a3d);
}

.weather-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.18);
}

.weather-card.is-selected {
  outline: 3px solid #ffe066;
  outline-offset: 2px;
}

.favorite-star {
  position: absolute;
  top: 8px;
  right: 8px;
  border: none;
  background: transparent;
  font-size: 1.2rem;
  line-height: 1;
  padding: 4px;
  cursor: pointer;
  opacity: 0.7;
}

.favorite-star:hover {
  opacity: 1;
}

.favorite-star.is-favorite {
  opacity: 1;
}

.card-icon {
  font-size: 2rem;
  margin-bottom: 6px;
}

.city-name {
  font-size: 1.1rem;
  margin-bottom: 4px;
}

.temp {
  font-size: 1.9rem;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
}

.deg {
  font-size: 1rem;
  font-weight: 400;
  opacity: 0.85;
}

.status-text {
  opacity: 0.9;
  margin-bottom: 8px;
}

.badge {
  display: inline-block;
  font-size: 0.75rem;
  background: rgba(255, 255, 255, 0.25);
  border-radius: 999px;
  padding: 4px 10px;
  margin-bottom: 12px;
}

.detail-btn {
  display: block;
  width: 100%;
  border: none;
  border-radius: 8px;
  padding: 8px 0;
  background: rgba(255, 255, 255, 0.9);
  color: #333;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.15s ease;
}

.detail-btn:hover {
  background: #ffffff;
}
</style>
