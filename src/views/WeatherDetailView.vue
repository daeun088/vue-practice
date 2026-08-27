<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { findCityById, getOutfitCategory, WEATHER_ICONS } from '../components/exercise/weatherData'
import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import { useConfigStore } from '../stores/configStore'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()

const city = ref(null)

onMounted(() => {
  city.value = findCityById(route.params.cityId)
})

const outfit = computed(() => (city.value ? getOutfitCategory(city.value.temp) : null))
const displayTemp = computed(() => (city.value ? configStore.convertTemp(city.value.temp) : null))

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="detail-page">
    <template v-if="city">
      <header class="detail-header">
        <div class="icon">{{ WEATHER_ICONS[city.status] ?? '🌈' }}</div>
        <h2>{{ city.name }}</h2>
        <p class="status">{{ city.status }} · {{ displayTemp }}{{ configStore.unitSymbol }}</p>
      </header>

      <BaseDashboardCard title="상세 관측 정보">
        <ul class="detail-list">
          <li><span>습도</span><strong>{{ city.humidity }}%</strong></li>
          <li><span>풍속</span><strong>{{ city.windSpeed }} m/s</strong></li>
          <li>
            <span>추천 코디</span>
            <strong>{{ outfit.emoji }} {{ outfit.label }}</strong>
          </li>
        </ul>
        <p class="description">{{ city.description }}</p>
      </BaseDashboardCard>
    </template>

    <template v-else>
      <p class="not-found">'{{ route.params.cityId }}'에 해당하는 도시 정보를 찾을 수 없습니다.</p>
    </template>

    <button class="back-btn" @click="goHome">← 대시보드로 돌아가기</button>
  </div>
</template>

<style scoped>
.detail-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 24px;
}

.detail-header {
  text-align: center;
  margin-bottom: 24px;
}

.detail-header .icon {
  font-size: 2.5rem;
}

.detail-header h2 {
  font-size: 1.6rem;
  margin: 8px 0 4px;
}

.status {
  opacity: 0.7;
}

.detail-list {
  list-style: none;
  padding: 0;
  margin: 0 0 16px;
}

.detail-list li {
  display: flex;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid var(--color-border);
}

.detail-list li:last-child {
  border-bottom: none;
}

.description {
  opacity: 0.8;
  font-size: 0.9rem;
}

.not-found {
  text-align: center;
  padding: 40px 0;
}

.back-btn {
  display: block;
  margin: 24px auto 0;
  border: 1px solid var(--color-border);
  background: var(--color-background-soft);
  color: var(--color-text);
  border-radius: 999px;
  padding: 8px 18px;
  cursor: pointer;
}

.back-btn:hover {
  border-color: #42b883;
}
</style>
