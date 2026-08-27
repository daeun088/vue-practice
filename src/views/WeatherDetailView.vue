<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { findCityMetaById } from '../components/exercise/cities'
import { getOutfitCategory } from '../components/exercise/weatherData'
import { fetchCurrentWeather, fetchForecast } from '../services/weatherApi'
import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import { useConfigStore } from '../stores/configStore'

const route = useRoute()
const router = useRouter()
const configStore = useConfigStore()

const cityMeta = findCityMetaById(route.params.cityId)

const city = ref(null)
const forecast = ref([])
const isLoading = ref(true)
const loadError = ref('')

const outfit = computed(() => (city.value ? getOutfitCategory(city.value.temp) : null))
const displayTemp = computed(() => (city.value ? configStore.convertTemp(city.value.temp) : null))
const displayFeelsLike = computed(() =>
  city.value ? configStore.convertTemp(city.value.feelsLike) : null,
)

const dailyForecast = computed(() => forecast.value.filter((entry) => entry.dateTime.includes('12:00:00')))

const formatForecastDate = (dateTime) => {
  const [, month, day] = dateTime.split(/[- ]/)
  return `${Number(month)}/${Number(day)}`
}

const goHome = () => {
  router.push('/')
}

onMounted(async () => {
  if (!cityMeta) {
    isLoading.value = false
    return
  }

  try {
    const [currentWeather, forecastList] = await Promise.all([
      fetchCurrentWeather(cityMeta),
      fetchForecast(cityMeta),
    ])
    city.value = currentWeather
    forecast.value = forecastList
  } catch (err) {
    console.error(err)
    loadError.value =
      err.response?.status === 401
        ? 'API 키가 유효하지 않습니다. .env 파일을 확인해주세요.'
        : '날씨 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="detail-page">
    <p v-if="isLoading" class="not-found">날씨 정보를 불러오는 중입니다...</p>

    <template v-else-if="city">
      <header class="detail-header">
        <img class="icon" :src="city.iconUrl" :alt="city.status" />
        <h2>{{ city.name }}</h2>
        <p class="status">{{ city.status }} · {{ displayTemp }}{{ configStore.unitSymbol }}</p>
      </header>

      <BaseDashboardCard title="상세 관측 정보">
        <ul class="detail-list">
          <li><span>체감 온도</span><strong>{{ displayFeelsLike }}{{ configStore.unitSymbol }}</strong></li>
          <li><span>습도</span><strong>{{ city.humidity }}%</strong></li>
          <li><span>풍속</span><strong>{{ city.windSpeed }} m/s</strong></li>
          <li>
            <span>추천 코디</span>
            <strong>{{ outfit.emoji }} {{ outfit.label }}</strong>
          </li>
        </ul>
      </BaseDashboardCard>

      <BaseDashboardCard title="5일 예보">
        <ul v-if="dailyForecast.length > 0" class="forecast-list">
          <li v-for="entry in dailyForecast" :key="entry.dateTime">
            <span>{{ formatForecastDate(entry.dateTime) }}</span>
            <img class="forecast-icon" :src="entry.iconUrl" :alt="entry.status" />
            <strong>{{ configStore.convertTemp(entry.temp) }}{{ configStore.unitSymbol }}</strong>
          </li>
        </ul>
        <p v-else class="not-found">예보 정보를 불러오지 못했습니다.</p>
      </BaseDashboardCard>
    </template>

    <template v-else-if="loadError">
      <p class="not-found">{{ loadError }}</p>
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
  width: 80px;
  height: 80px;
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

.forecast-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.forecast-list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 0;
  border-bottom: 1px solid var(--color-border);
}

.forecast-list li:last-child {
  border-bottom: none;
}

.forecast-icon {
  width: 36px;
  height: 36px;
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
