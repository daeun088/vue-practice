<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { findCityMetaById } from '../components/exercise/cities'
import { getOutfitCategory } from '../components/exercise/weatherData'
import { fetchCurrentWeather, fetchForecast } from '../services/weatherApi'
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
const dailyForecast = computed(() =>
  forecast.value.filter((entry) => entry.dateTime.includes('12:00:00')),
)
const formatForecastDate = (dateTime) => {
  const [, month, day] = dateTime.split(/[- ]/)
  return `${Number(month)}/${Number(day)}`
}

const goHome = () => {
  router.push('/weather-vuetify')
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
  } catch {
    loadError.value = '날씨 정보를 불러오지 못했습니다. 잠시 후 다시 시도해주세요.'
  } finally {
    isLoading.value = false
  }
})
</script>

<template>
  <div class="detail-page">
    <div v-if="isLoading" class="text-center py-10">
      <v-progress-circular indeterminate color="primary" />
    </div>

    <v-card v-else-if="city" class="mx-auto" max-width="480">
      <v-card-item>
        <template #prepend>
          <v-avatar size="56">
            <v-img :src="city.iconUrl" :alt="city.status" />
          </v-avatar>
        </template>
        <v-card-title>{{ city.name }}</v-card-title>
        <v-card-subtitle>
          {{ city.status }} · {{ configStore.convertTemp(city.temp) }}{{ configStore.unitSymbol }}
        </v-card-subtitle>
      </v-card-item>

      <v-divider />

      <v-list density="comfortable">
        <v-list-item>
          <v-list-item-title>체감 온도</v-list-item-title>
          <template #append
            >{{ configStore.convertTemp(city.feelsLike) }}{{ configStore.unitSymbol }}</template
          >
        </v-list-item>
        <v-list-item>
          <v-list-item-title>습도</v-list-item-title>
          <template #append>{{ city.humidity }}%</template>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>풍속</v-list-item-title>
          <template #append>{{ city.windSpeed }} m/s</template>
        </v-list-item>
        <v-list-item>
          <v-list-item-title>추천 코디</v-list-item-title>
          <template #append>
            <v-chip size="small">{{ outfit.emoji }} {{ outfit.label }}</v-chip>
          </template>
        </v-list-item>
      </v-list>

      <v-divider />

      <v-card-text>
        <p class="text-subtitle-2 mb-2">5일 예보</p>
        <v-list density="compact">
          <v-list-item v-for="entry in dailyForecast" :key="entry.dateTime">
            <template #prepend>
              <v-avatar size="28"><v-img :src="entry.iconUrl" /></v-avatar>
            </template>
            <v-list-item-title>{{ formatForecastDate(entry.dateTime) }}</v-list-item-title>
            <template #append
              >{{ configStore.convertTemp(entry.temp) }}{{ configStore.unitSymbol }}</template
            >
          </v-list-item>
        </v-list>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn variant="tonal" @click="goHome">← 대시보드로 돌아가기</v-btn>
      </v-card-actions>
    </v-card>

    <v-alert v-else-if="loadError" type="error" variant="tonal" class="mx-auto" max-width="480">
      {{ loadError }}
    </v-alert>

    <v-alert v-else type="warning" variant="tonal" class="mx-auto" max-width="480">
      '{{ route.params.cityId }}'에 해당하는 도시 정보를 찾을 수 없습니다.
    </v-alert>
  </div>
</template>

<style scoped>
.detail-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 24px;
}
</style>
