<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { cities } from '../components/exercise/cities'
import { fetchCurrentWeatherList } from '../services/weatherApi'
import { fetchHolidays } from '../services/holidayApi'
import { OUTFIT_GUIDE } from '../components/exercise/weatherData'
import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import SearchBar from '../components/exercise/SearchBar.vue'
import WeatherCard from '../components/exercise/WeatherCard.vue'
import { useConfigStore } from '../stores/configStore'
import { useFavoritesStore } from '../stores/favoritesStore'

const router = useRouter()
const configStore = useConfigStore()
const favoritesStore = useFavoritesStore()

const weatherList = ref([])
const isLoading = ref(true)
const loadError = ref('')
const searchQuery = ref('')

const holidays = ref([])
const today = new Date()

const filteredWeatherList = computed(() => {
  const keyword = searchQuery.value.trim()
  if (!keyword) return weatherList.value
  return weatherList.value.filter((city) => city.name.includes(keyword))
})

const formatHolidayDate = (date) => `${Number(date.slice(4, 6))}월 ${Number(date.slice(6, 8))}일`

const toggleFavorite = (city) => {
  favoritesStore.toggleFavorite(city.id)
}

const goToDetail = (city) => {
  router.push('/weather-vuetify/' + city.id)
}

onMounted(async () => {
  try {
    weatherList.value = await fetchCurrentWeatherList(cities)
  } catch {
    loadError.value = '날씨 정보를 불러오지 못했습니다.'
  } finally {
    isLoading.value = false
  }

  try {
    holidays.value = await fetchHolidays({ year: today.getFullYear(), month: today.getMonth() + 1 })
  } catch {
    holidays.value = []
  }
})
</script>

<template>
  <div class="weather-page">
    <header class="weather-header">
      <h2>🌦️ 오늘 뭐 입지?</h2>
      <p class="subtitle">도시별 날씨에 맞는 코디를 추천해드려요</p>
    </header>

    <div class="layout-grid">
      <div class="layout-left">
        <BaseDashboardCard title="이번 달 공휴일">
          <ul v-if="holidays.length > 0" class="holiday-list">
            <li v-for="holiday in holidays" :key="holiday.date">
              <span>{{ formatHolidayDate(holiday.date) }}</span>
              <strong>{{ holiday.name }}</strong>
            </li>
          </ul>
          <p v-else class="empty-msg">이번 달은 공휴일이 없습니다.</p>
        </BaseDashboardCard>

        <BaseDashboardCard title="코디 가이드">
          <ul class="guide-list">
            <li v-for="item in OUTFIT_GUIDE" :key="item.key">
              <span class="guide-emoji">{{ item.emoji }}</span>
              <span class="guide-label">{{ item.label }}</span>
              <span class="guide-range">{{ item.range }}</span>
            </li>
          </ul>
        </BaseDashboardCard>
      </div>

      <div class="layout-right">
        <BaseDashboardCard title="도시 검색">
          <SearchBar :search-query="searchQuery" @update-query="searchQuery = $event" />
        </BaseDashboardCard>

        <BaseDashboardCard title="지역별 날씨 현황">
          <div class="unit-row">
            <v-btn-toggle v-model="configStore.unit" mandatory density="comfortable" color="primary">
              <v-btn value="celsius">°C</v-btn>
              <v-btn value="fahrenheit">°F</v-btn>
            </v-btn-toggle>
          </div>

          <p v-if="isLoading" class="empty-msg">날씨 정보를 불러오는 중입니다...</p>
          <p v-else-if="loadError" class="empty-msg">{{ loadError }}</p>
          <div v-else-if="filteredWeatherList.length > 0" class="weather-cards">
            <WeatherCard
              v-for="city in filteredWeatherList"
              :key="city.id"
              :city="city"
              :is-favorite="favoritesStore.isFavorite(city.id)"
              @click-detail="goToDetail"
              @toggle-favorite="toggleFavorite"
            />
          </div>
          <p class="empty-msg" v-else>'{{ searchQuery }}'와 일치하는 도시가 없습니다 🥲</p>
        </BaseDashboardCard>
      </div>
    </div>
  </div>
</template>

<style scoped>
.weather-page {
  max-width: 1140px;
  margin: 0 auto;
  padding: 24px;
}

.layout-grid {
  display: grid;
  grid-template-columns: 2fr 3fr;
  gap: 20px;
  align-items: start;
}

.layout-left,
.layout-right {
  min-width: 0;
}

@media (max-width: 860px) {
  .layout-grid {
    grid-template-columns: 1fr;
  }
}

.weather-header {
  text-align: center;
  margin-bottom: 24px;
}

.weather-header h2 {
  font-size: 1.8rem;
  margin-bottom: 4px;
}

.lib-badge {
  font-size: 0.9rem;
  vertical-align: middle;
  opacity: 0.7;
}

.subtitle {
  color: var(--color-text);
  opacity: 0.78;
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

.holiday-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.holiday-list li {
  display: flex;
  justify-content: space-between;
  padding: 6px 0;
  border-bottom: 1px solid var(--color-border);
}

.holiday-list li:last-child {
  border-bottom: none;
}

.unit-row {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 16px;
}

.guide-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.guide-list li {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 12px;
  border: 1px solid var(--color-border);
  border-radius: 10px;
}

.guide-emoji {
  font-size: 1.3rem;
}

.guide-label {
  flex: 1;
  font-size: 0.9rem;
}

.guide-range {
  font-size: 0.8rem;
  opacity: 0.7;
}
</style>
