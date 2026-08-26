<script setup>
import { ref } from 'vue'

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

// 양방향 바인딩 및 한글 처리 (:value, @input)
const searchKeyword = ref('')
const handleSearchInput = (event) => {
  searchKeyword.value = event.target.value
}
const handleSearchEnter = () => {
  if (!searchKeyword.value.trim()) return
  window.alert(`'${searchKeyword.value}' 검색을 실행했습니다.`)
}
const handleSearchEsc = () => {
  searchKeyword.value = ''
}

// 마지막 글자 받침 유무에 따라 '이/가' 조사를 고른다
const getSubjectParticle = (word) => {
  const lastChar = word.charCodeAt(word.length - 1)
  const hasBatchim = (lastChar - 0xac00) % 28 !== 0
  return hasBatchim ? '이' : '가'
}

// 카드 클릭 → 상태바 문구
const selectedCityId = ref(null)
const selectedMessage = ref('')
const selectCity = (city) => {
  selectedCityId.value = city.id
  selectedMessage.value = `${city.name}${getSubjectParticle(city.name)} 선택되었습니다.`
}

// [상세보기] 버튼 클릭 시 alert 창 오픈
const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
}

// 별 아이콘 클릭으로 즐겨찾기 토글
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

// 우클릭(contextmenu) + .prevent 로 즐겨찾기 정보 출력
const showContextInfo = (city) => {
  window.alert(
    `[우클릭 메뉴]\n${city.name}은(는) 즐겨찾기 ${
      favoriteCityIds.value.has(city.id) ? '등록됨 ⭐' : '미등록'
    } 상태입니다.`,
  )
}

// 온도 더블클릭 시 °C/°F 전환
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

// 새로고침 버튼은 최초 1회만 동작 (.once)
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
    <header class="weather-header">
      <h2>🌤️ Weather Mockup</h2>
      <p class="subtitle">오늘의 도시별 날씨를 한눈에 확인해보세요</p>
      <button class="refresh-btn" @click.once="refreshWeatherOnce">
        {{ isRefreshed ? '✅ 새로고침 완료' : '🔄 온도 새로고침' }}
      </button>
    </header>

    <div class="search-box">
      <span class="search-icon">🔍</span>
      <input
        type="text"
        :value="searchKeyword"
        @input="handleSearchInput"
        @keyup.enter="handleSearchEnter"
        @keyup.esc="handleSearchEsc"
        placeholder="도시 이름을 입력하고 Enter (Esc로 초기화)"
      />
    </div>
    <p class="search-echo" v-if="searchKeyword">
      <span class="dot"></span>입력한 도시명: <strong>{{ searchKeyword }}</strong>
    </p>

    <transition name="fade">
      <p v-if="selectedMessage" class="status-bar">{{ selectedMessage }}</p>
    </transition>

    <div class="weather-cards">
      <div
        class="weather-card"
        :class="{ 'is-hot': city.temp >= 25, 'is-selected': city.id === selectedCityId }"
        v-for="city in weatherList"
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

        <p class="badge" v-if="city.temp >= 25">🔥 더움 (25도 이상)</p>
        <p class="badge cool" v-else>❄️ 선선함 (25도 미만)</p>

        <button class="detail-btn" @click.stop="showDetail(city.name, city.status)">
          상세보기
        </button>
      </div>
    </div>
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

.status-bar {
  text-align: center;
  font-weight: 600;
  color: #ffffff;
  background: linear-gradient(135deg, #42b883, #2b7a5c);
  padding: 10px 16px;
  border-radius: 10px;
  max-width: 420px;
  margin: 0 auto 20px;
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.25s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(-6px);
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
</style>
