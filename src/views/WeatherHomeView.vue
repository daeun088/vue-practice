<script setup>
import { ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import { mockCities } from '../components/exercise/weatherData'
import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import SearchBar from '../components/exercise/SearchBar.vue'
import WeatherCard from '../components/exercise/WeatherCard.vue'
import { useFavoritesStore } from '../stores/favoritesStore'

const router = useRouter()
const favoritesStore = useFavoritesStore()

const weatherList = ref(mockCities)
const searchQuery = ref('')
const selectedCityId = ref(null)

const filteredWeatherList = computed(() => {
  const keyword = searchQuery.value.trim()
  if (!keyword) return weatherList.value
  return weatherList.value.filter((city) => city.name.includes(keyword))
})

const selectCity = (city) => {
  selectedCityId.value = city.id
}

const goToDetail = (city) => {
  router.push('/weather/' + city.id)
}

const toggleFavorite = (city) => {
  favoritesStore.toggleFavorite(city.id)
}
</script>

<template>
  <div class="weather-page">
    <header class="weather-header">
      <h2>🌦️ 오늘 뭐 입지?</h2>
      <p class="subtitle">도시별 날씨에 맞는 코디를 추천해드려요</p>
    </header>

    <BaseDashboardCard title="도시 검색">
      <SearchBar :search-query="searchQuery" @update-query="searchQuery = $event" />
    </BaseDashboardCard>

    <BaseDashboardCard title="지역별 날씨 현황">
      <div class="weather-cards" v-if="filteredWeatherList.length > 0">
        <WeatherCard
          v-for="city in filteredWeatherList"
          :key="city.id"
          :city="city"
          :is-selected="city.id === selectedCityId"
          :is-favorite="favoritesStore.isFavorite(city.id)"
          @select-card="selectCity"
          @click-detail="goToDetail"
          @toggle-favorite="toggleFavorite"
        />
      </div>
      <p class="empty-msg" v-else>'{{ searchQuery }}'와 일치하는 도시가 없습니다 🥲</p>
    </BaseDashboardCard>
  </div>
</template>

<style scoped>
.weather-page {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px;
}

.weather-header {
  text-align: center;
  margin-bottom: 24px;
}

.weather-header h2 {
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
