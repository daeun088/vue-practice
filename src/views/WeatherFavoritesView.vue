<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { mockCities } from '../components/exercise/weatherData'
import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import WeatherCard from '../components/exercise/WeatherCard.vue'

const STORAGE_KEY = 'weather-favorite-city-ids'

const router = useRouter()
const favoriteCityIds = ref(new Set())
const favoriteCities = ref([])

const syncFavorites = () => {
  favoriteCities.value = mockCities.filter((city) => favoriteCityIds.value.has(city.id))
}

onMounted(() => {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    favoriteCityIds.value = new Set(saved)
  } catch {
    favoriteCityIds.value = new Set()
  }
  syncFavorites()
})

const toggleFavorite = (city) => {
  const next = new Set(favoriteCityIds.value)
  if (next.has(city.id)) {
    next.delete(city.id)
  } else {
    next.add(city.id)
  }
  favoriteCityIds.value = next
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...next]))
  syncFavorites()
}

const goToDetail = (city) => {
  router.push('/weather/' + city.id)
}
</script>

<template>
  <div class="favorites-page">
    <header class="favorites-header">
      <h2>⭐ 즐겨찾는 도시</h2>
      <p class="subtitle">홈에서 즐겨찾기한 도시를 이곳에서 모아볼 수 있어요</p>
    </header>

    <BaseDashboardCard title="즐겨찾기 목록">
      <div class="weather-cards" v-if="favoriteCities.length > 0">
        <WeatherCard
          v-for="city in favoriteCities"
          :key="city.id"
          :city="city"
          :is-favorite="true"
          @click-detail="goToDetail"
          @toggle-favorite="toggleFavorite"
        />
      </div>
      <p class="empty-msg" v-else>
        아직 즐겨찾기한 도시가 없습니다. 홈에서 ☆ 버튼을 눌러 추가해보세요.
      </p>
    </BaseDashboardCard>
  </div>
</template>

<style scoped>
.favorites-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
}

.favorites-header {
  text-align: center;
  margin-bottom: 24px;
}

.favorites-header h2 {
  font-size: 1.8rem;
  margin-bottom: 4px;
}

.subtitle {
  color: var(--color-text);
  opacity: 0.6;
  font-size: 0.9rem;
}

.weather-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
}

.empty-msg {
  text-align: center;
  padding: 24px 0;
}
</style>
