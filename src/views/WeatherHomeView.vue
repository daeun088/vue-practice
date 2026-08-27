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
import { useFavoritesStore } from '../stores/favoritesStore'

const router = useRouter()
const favoritesStore = useFavoritesStore()

const weatherList = ref([])
const isLoading = ref(true)
const loadError = ref('')

const searchQuery = ref('')
const selectedCityId = ref(null)

const holidays = ref([])
const holidaysError = ref(false)

const today = new Date()

const filteredWeatherList = computed(() => {
  const keyword = searchQuery.value.trim()
  if (!keyword) return weatherList.value
  return weatherList.value.filter((city) => city.name.includes(keyword))
})

const todayString = `${today.getFullYear()}${String(today.getMonth() + 1).padStart(2, '0')}${String(today.getDate()).padStart(2, '0')}`

const todayHoliday = computed(() =>
  holidays.value.find((holiday) => holiday.isHoliday && holiday.date === todayString),
)

const formatHolidayDate = (date) => `${Number(date.slice(4, 6))}월 ${Number(date.slice(6, 8))}일`

const selectCity = (city) => {
  selectedCityId.value = city.id
}

const goToDetail = (city) => {
  router.push('/weather/' + city.id)
}

const toggleFavorite = (city) => {
  favoritesStore.toggleFavorite(city.id)
}

onMounted(async () => {
  try {
    weatherList.value = await fetchCurrentWeatherList(cities)
  } catch (err) {
    console.error(err)
    loadError.value =
      err.response?.status === 401
        ? 'API 키가 유효하지 않습니다. .env 파일을 확인해주세요.'
        : '날씨 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.'
  } finally {
    isLoading.value = false
  }

  try {
    holidays.value = await fetchHolidays({ year: today.getFullYear(), month: today.getMonth() + 1 })
  } catch (err) {
    console.error(err)
    holidaysError.value = true
  }
})
</script>

<template>
  <div class="weather-page">
    <header class="weather-header">
      <h2>🌦️ 오늘 뭐 입지?</h2>
      <p class="subtitle">도시별 날씨에 맞는 코디를 추천해드려요</p>
    </header>

    <BaseDashboardCard title="이번 달 공휴일">
      <p v-if="todayHoliday" class="today-holiday">🎉 오늘은 {{ todayHoliday.name }}입니다</p>
      <p v-if="holidaysError" class="empty-msg">공휴일 정보를 불러오지 못했습니다.</p>
      <ul v-else-if="holidays.length > 0" class="holiday-list">
        <li v-for="holiday in holidays" :key="holiday.date">
          <span>{{ formatHolidayDate(holiday.date) }}</span>
          <strong>{{ holiday.name }}</strong>
        </li>
      </ul>
      <p v-else class="empty-msg">이번 달은 공휴일이 없습니다.</p>
    </BaseDashboardCard>

    <BaseDashboardCard title="도시 검색">
      <SearchBar :search-query="searchQuery" @update-query="searchQuery = $event" />
    </BaseDashboardCard>

    <BaseDashboardCard title="지역별 날씨 현황">
      <p v-if="isLoading" class="empty-msg">날씨 정보를 불러오는 중입니다...</p>
      <p v-else-if="loadError" class="empty-msg">{{ loadError }}</p>
      <div v-else-if="filteredWeatherList.length > 0" class="weather-cards">
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

.today-holiday {
  text-align: center;
  font-weight: 600;
  margin-bottom: 12px;
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

.guide-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;
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
  opacity: 0.78;
}
</style>
