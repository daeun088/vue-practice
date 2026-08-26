<script setup>
import { ref, computed, watch, watchEffect } from 'vue'
import { getOutfitCategory } from './outfit'

const weatherList = ref([
  { id: 'city_01', name: '서울', temp: 28, status: '맑음' },
  { id: 'city_02', name: '수원', temp: 24, status: '비' },
  { id: 'city_03', name: '부산', temp: 26, status: '구름' },
  { id: 'city_04', name: '제주', temp: 30, status: '맑음' },
])

const weatherIcons = {
  맑음: '☀️',
  비: '🌧️',
  구름: '☁️',
}

const searchQuery = ref('')
const handleSearchInput = (event) => {
  searchQuery.value = event.target.value
}
const handleSearchEnter = () => {
  if (!searchQuery.value.trim()) return
  window.alert(`'${searchQuery.value}' 검색을 실행했습니다.`)
}
const handleSearchEsc = () => {
  searchQuery.value = ''
}

const filteredWeatherList = computed(() => {
  const keyword = searchQuery.value.trim()
  if (!keyword) return weatherList.value
  return weatherList.value.filter((city) => city.name.includes(keyword))
})

const sortOrder = ref('default') // 'default' | 'asc' | 'desc'
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

const selectedCityInfo = ref(null)
const statusMessage = ref('')
const selectCity = (city) => {
  selectedCityInfo.value = city
}

// 선택 토스트는 잠깐 떴다가 자동으로 종료
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

const favoriteCityIds = ref(new Set())
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

const fahrenheitCityIds = ref(new Set())
const toggleTempUnit = (city) => {
  const next = new Set(fahrenheitCityIds.value)
  if (next.has(city.id)) {
    next.delete(city.id)
  } else {
    next.add(city.id)
  }
  fahrenheitCityIds.value = next
}
const displayTemp = (city) =>
  fahrenheitCityIds.value.has(city.id) ? Math.round((city.temp * 9) / 5 + 32) : city.temp

const isRefreshed = ref(false)
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

    <div class="search-box">
      <span class="search-icon">🔍</span>
      <input
        type="text"
        :value="searchQuery"
        @input="handleSearchInput"
        @keyup.enter="handleSearchEnter"
        @keyup.esc="handleSearchEsc"
        placeholder="도시 이름 검색하세요"
      />
    </div>

    <p class="search-echo" v-if="searchQuery">
      <span class="dot"></span>입력한 도시명: <strong>{{ searchQuery }}</strong>
    </p>

    <div class="sort-controls">
      <span class="sort-label">정렬</span>
      <button
        v-for="option in [
          { value: 'default', label: '기본순' },
          { value: 'asc', label: '온도 낮은순' },
          { value: 'desc', label: '온도 높은순' },
        ]"
        :key="option.value"
        class="sort-btn"
        :class="{ active: sortOrder === option.value }"
        @click="sortOrder = option.value"
      >
        {{ option.label }}
      </button>
    </div>

    <div class="outfit-summary" v-if="filteredWeatherList.length > 0">
      <span>👕 {{ outfitSummary.counts.hot }}</span>
      <span>👔 {{ outfitSummary.counts.mild }}</span>
      <span>🧶 {{ outfitSummary.counts.cool }}</span>
      <span>🧥 {{ outfitSummary.counts.cold }}</span>
      <span class="umbrella">☂️ 우산 필요 {{ outfitSummary.umbrellaCount }}곳</span>
    </div>

    <div class="outfit-hero" v-if="selectedCityInfo">
      <div class="hero-emoji">{{ selectedOutfit.emoji }}</div>
      <div class="hero-body">
        <p class="hero-city">
          {{ selectedCityInfo.name }} · {{ selectedCityInfo.temp }}°C ·
          {{ selectedCityInfo.status }}
        </p>
        <p class="hero-outfit">
          오늘의 코디 추천: <strong>{{ selectedOutfit.label }}</strong>
        </p>
        <p class="hero-umbrella" v-if="needsUmbrella">비 소식이 있어요, 우산도 챙기세요!</p>
      </div>
    </div>
    <div class="outfit-hero outfit-hero--placeholder" v-else>
      도시 카드를 누르면 오늘의 코디를 추천해드려요
    </div>

    <div class="weather-cards" v-if="filteredWeatherList.length > 0">
      <div
        class="weather-card"
        :class="{ 'is-hot': city.temp >= 25, 'is-selected': city.id === selectedCityInfo?.id }"
        v-for="city in sortedWeatherList"
        :key="city.id"
        @click="selectCity(city)"
        @contextmenu.prevent="showContextInfo(city)"
      >
        <button
          class="favorite-star"
          :class="{ 'is-favorite': favoriteCityIds.has(city.id) }"
          @click.stop="toggleFavorite(city)"
        >
          {{ favoriteCityIds.has(city.id) ? '⭐' : '☆' }}
        </button>
        <div class="card-icon">{{ weatherIcons[city.status] ?? '🌈' }}</div>
        <h3 class="city-name">{{ city.name }}</h3>
        <p
          class="temp"
          @click.stop
          @dblclick.stop="toggleTempUnit(city)"
          title="더블클릭: °C/°F 전환"
        >
          {{ displayTemp(city)
          }}<span class="deg">{{ fahrenheitCityIds.has(city.id) ? '°F' : '°C' }}</span>
        </p>
        <p class="status-text">{{ city.status }}</p>

        <p class="badge">
          {{ getOutfitCategory(city.temp).emoji }} {{ getOutfitCategory(city.temp).label }}
        </p>

        <button class="detail-btn" @click.stop="showDetail(city)">상세보기</button>
      </div>
    </div>
    <p class="empty-msg" v-else>'{{ searchQuery }}'와 일치하는 도시가 없습니다 🥲</p>
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

.search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 420px;
  margin: 0 auto 8px;
  padding: 10px 16px;
  border-radius: 999px;
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
}

.search-box input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: 0.95rem;
  color: var(--color-text);
}

.search-echo {
  text-align: center;
  font-size: 0.85rem;
  opacity: 0.75;
  margin-bottom: 16px;
}

.search-echo .dot {
  display: inline-block;
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #42b883;
  margin-right: 6px;
}

.sort-controls {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.sort-label {
  font-size: 0.85rem;
  opacity: 0.6;
}

.sort-btn {
  border: 1px solid var(--color-border);
  background: var(--color-background-soft);
  color: var(--color-text);
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 0.85rem;
  cursor: pointer;
}

.sort-btn:hover {
  border-color: #42b883;
}

.sort-btn.active {
  background: #42b883;
  border-color: #42b883;
  color: #fff;
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

.outfit-hero {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 18px 22px;
  margin-bottom: 24px;
  border-radius: 16px;
  background: linear-gradient(135deg, #6fb1fc, #4a7fe0);
  color: #fff;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.12);
}

.outfit-hero--placeholder {
  justify-content: center;
  text-align: center;
  background: var(--color-background-soft);
  color: var(--color-text);
  border: 1px dashed var(--color-border);
  box-shadow: none;
}

.hero-emoji {
  font-size: 2.5rem;
  line-height: 1;
}

.hero-city {
  font-size: 0.85rem;
  margin-bottom: 4px;
}

.hero-outfit {
  font-size: 1.1rem;
}

.hero-umbrella {
  margin-top: 6px;
  font-size: 0.9rem;
}

.weather-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 16px;
}

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

.empty-msg {
  text-align: center;
  opacity: 0.6;
  padding: 24px 0;
}
</style>
