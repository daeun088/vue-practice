<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
import { getOutfitCategory } from './outfit'
import BaseDashboardCard from './BaseDashboardCard.vue'
import SearchBar from './SearchBar.vue'
import SortControls from './SortControls.vue'
import OutfitHeroPanel from './OutfitHeroPanel.vue'
import WeatherCard from './WeatherCard.vue'

const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  { id: 'city_04', name: '제주', temp: 30, status: '맑음' },
])

const searchQuery = ref('')
const sortOrder = ref('default') // 'default' | 'asc' | 'desc'
const selectedCityInfo = ref(null)
const statusMessage = ref('')
const favoriteCityIds = ref(new Set())
const fahrenheitCityIds = ref(new Set())
const isRefreshed = ref(false)

const filteredWeatherList = computed(() => {
  const keyword = searchQuery.value.trim()
  if (!keyword) return weatherList.value
  return weatherList.value.filter((city) => city.name.includes(keyword))
})

const sortedWeatherList = computed(() => {
  const list = [...filteredWeatherList.value]
  if (sortOrder.value === 'asc') return list.sort((a, b) => a.temp - b.temp)
  if (sortOrder.value === 'desc') return list.sort((a, b) => b.temp - a.temp)
  return list
})

const getSubjectParticle = (word) => {
  const lastChar = word.charCodeAt(word.length - 1)
  const hasBatchim = (lastChar - 0xac00) % 28 !== 0
  return hasBatchim ? '이' : '가'
}

const selectCity = (city) => {
  selectedCityInfo.value = city
}

let toastTimer = null
watch(selectedCityInfo, (newCity) => {
  if (!newCity) return
  statusMessage.value = `${newCity.name}${getSubjectParticle(newCity.name)} 선택되었습니다.`
  console.log(`[watch] 상태바 문구 변경 → "${statusMessage.value}"`)

  clearTimeout(toastTimer)
  toastTimer = setTimeout(() => {
    statusMessage.value = ''
  }, 2000)
})

watchEffect(() => {
  console.log(`[watchEffect] searchQuery 변경 감지 → '${searchQuery.value}'`)
})

watch(sortOrder, (newOrder) => {
  console.log(`[watch] 정렬 기준 변경 → ${newOrder}`)
})

const selectedOutfit = computed(() =>
  selectedCityInfo.value ? getOutfitCategory(selectedCityInfo.value.temp) : null,
)

watch(
  () => selectedOutfit.value?.key,
  (newKey, oldKey) => {
    if (!newKey) return
    if (oldKey && newKey !== oldKey) {
      console.log(
        `[watch] 코디 카테고리 변경 → ${oldKey} → ${newKey} (${selectedOutfit.value.emoji} ${selectedOutfit.value.label})`,
      )
    } else {
      console.log(`[watch] 코디 추천 → ${selectedOutfit.value.emoji} ${selectedOutfit.value.label}`)
    }
  },
)

const needsUmbrella = computed(() => selectedCityInfo.value?.status === '비')
watchEffect(() => {
  const cityName = selectedCityInfo.value?.name ?? '없음'
  console.log(
    `[watchEffect] 우산 필요 여부 확인 → 선택된 도시: ${cityName} / ${needsUmbrella.value ? '☂️ 우산 필요' : '우산 불필요'}`,
  )
})

const outfitSummary = computed(() => {
  const counts = { hot: 0, mild: 0, cool: 0, cold: 0 }
  let umbrellaCount = 0
  filteredWeatherList.value.forEach((city) => {
    counts[getOutfitCategory(city.temp).key] += 1
    if (city.status === '비') umbrellaCount += 1
  })
  return { counts, umbrellaCount, total: filteredWeatherList.value.length }
})

const showDetail = (city) => {
  window.alert(`${city.name}의 현재 날씨는 [${city.status}] 상태입니다.`)
}

const toggleFavorite = (city) => {
  const next = new Set(favoriteCityIds.value)
  if (next.has(city.id)) {
    next.delete(city.id)
  } else {
    next.add(city.id)
  }
  favoriteCityIds.value = next
}

const showContextInfo = (city) => {
  window.alert(
    `[우클릭 메뉴]\n${city.name}은(는) 즐겨찾기 ${
      favoriteCityIds.value.has(city.id) ? '등록됨 ⭐' : '미등록'
    } 상태입니다.`,
  )
}

const toggleTempUnit = (city) => {
  const next = new Set(fahrenheitCityIds.value)
  if (next.has(city.id)) {
    next.delete(city.id)
  } else {
    next.add(city.id)
  }
  fahrenheitCityIds.value = next
}

const refreshWeatherOnce = () => {
  weatherList.value = weatherList.value.map((city) => ({
    ...city,
    temp: Math.floor(Math.random() * 15) + 18,
  }))
  isRefreshed.value = true
}
</script>

<template>
  <div class="weather-page">
    <transition name="toast">
      <div v-if="statusMessage" class="toast">{{ statusMessage }}</div>
    </transition>

    <header class="weather-header">
      <h2>🌦️ 오늘 뭐 입지?</h2>
      <p class="subtitle">도시별 날씨에 맞는 코디를 추천해드려요</p>
      <button class="refresh-btn" @click.once="refreshWeatherOnce">
        {{ isRefreshed ? '새로고침 완료' : '온도 새로고침' }}
      </button>
    </header>

    <BaseDashboardCard title="도시 검색">
      <SearchBar :search-query="searchQuery" @update-query="searchQuery = $event" />
      <SortControls :sort-order="sortOrder" @update-sort="sortOrder = $event" />
    </BaseDashboardCard>

    <div class="outfit-summary" v-if="filteredWeatherList.length > 0">
      <span>👕 {{ outfitSummary.counts.hot }}</span>
      <span>👔 {{ outfitSummary.counts.mild }}</span>
      <span>🧶 {{ outfitSummary.counts.cool }}</span>
      <span>🧥 {{ outfitSummary.counts.cold }}</span>
      <span class="umbrella">☂️ 우산 필요 {{ outfitSummary.umbrellaCount }}곳</span>
    </div>

    <OutfitHeroPanel
      :city="selectedCityInfo"
      :outfit="selectedOutfit"
      :needs-umbrella="needsUmbrella"
    />

    <BaseDashboardCard title="지역별 날씨 현황">
      <div class="weather-cards" v-if="filteredWeatherList.length > 0">
        <WeatherCard
          v-for="city in sortedWeatherList"
          :key="city.id"
          :city="city"
          :is-selected="city.id === selectedCityInfo?.id"
          :is-favorite="favoriteCityIds.has(city.id)"
          :is-fahrenheit="fahrenheitCityIds.has(city.id)"
          @select-card="selectCity"
          @click-detail="showDetail"
          @toggle-favorite="toggleFavorite"
          @toggle-temp-unit="toggleTempUnit"
          @context-menu="showContextInfo"
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
  margin-bottom: 12px;
}

.refresh-btn {
  border: 1px solid var(--color-border);
  background: var(--color-background-soft);
  color: var(--color-text);
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 0.85rem;
  cursor: pointer;
}

.refresh-btn:hover {
  border-color: #42b883;
}

.outfit-summary {
  display: flex;
  justify-content: center;
  gap: 16px;
  flex-wrap: wrap;
  font-size: 0.9rem;
  margin-bottom: 20px;
}

.outfit-summary .umbrella {
  color: #4a7fe0;
  font-weight: 600;
}

.toast {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 10;
  background: linear-gradient(135deg, #42b883, #2b7a5c);
  color: #fff;
  font-weight: 600;
  padding: 10px 20px;
  border-radius: 999px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.18);
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}
.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateX(-50%) translateY(-10px);
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
