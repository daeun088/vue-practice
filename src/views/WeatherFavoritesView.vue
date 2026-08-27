<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { cities } from '../components/exercise/cities'
import { fetchCurrentWeatherList } from '../services/weatherApi'
import BaseDashboardCard from '../components/exercise/BaseDashboardCard.vue'
import WeatherCard from '../components/exercise/WeatherCard.vue'
import { useFavoritesStore } from '../stores/favoritesStore'

const router = useRouter()
const favoritesStore = useFavoritesStore()

const weatherList = ref([])
const isLoading = ref(true)
const loadError = ref('')

const favoriteCities = computed(() =>
  weatherList.value.filter((city) => favoritesStore.isFavorite(city.id)),
)

const toggleFavorite = (city) => {
  favoritesStore.toggleFavorite(city.id)
}

const goToDetail = (city) => {
  router.push('/weather/' + city.id)
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
})
</script>

<template>
  <div class="favorites-page">
    <header class="favorites-header">
      <h2>⭐ 즐겨찾는 도시</h2>
      <p class="subtitle">홈에서 즐겨찾기한 도시를 이곳에서 모아볼 수 있어요</p>
    </header>

    <BaseDashboardCard title="즐겨찾기 목록">
      <p v-if="isLoading" class="empty-msg">날씨 정보를 불러오는 중입니다...</p>
      <p v-else-if="loadError" class="empty-msg">{{ loadError }}</p>
      <div v-else-if="favoriteCities.length > 0" class="weather-cards">
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
</style>
