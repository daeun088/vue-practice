<script setup>
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import WeatherMockup from '../components/weather/WeatherMockup.vue'
import WeatherComposition from '../components/weather/WeatherComposition.vue'
import WeatherParent from '../components/weather/WeatherParent.vue'
import WeatherVuetifyView from './WeatherVuetifyView.vue'

const records = [
  { key: 'day1', label: 'Day1', title: 'Weather Mockup', component: WeatherMockup },
  { key: 'day2', label: 'Day2', title: 'Weather Composition', component: WeatherComposition },
  { key: 'day3', label: 'Day3', title: 'Weather Dashboard', component: WeatherParent },
  { key: 'vuetify', label: 'Vuetify', title: 'Weather Vuetify', component: WeatherVuetifyView },
]

const route = useRoute()
const router = useRouter()

// 선택된 탭을 쿼리 파라미터로 관리 -> /weather-vuetify/:cityId 상세로 갔다가
// 뒤로가기로 돌아와도(컴포넌트가 다시 마운트돼도) 선택 상태가 유지됨
const selectedKey = computed(() => {
  const tab = route.query.tab
  return records.some((record) => record.key === tab) ? tab : records[0].key
})
const selectedRecord = computed(() => records.find((record) => record.key === selectedKey.value))

const selectTab = (key) => {
  router.replace({ query: { ...route.query, tab: key } })
}
</script>

<template>
  <div class="archive-page">
    <header class="archive-header">
      <h2>🗂️ 지난 기록</h2>
      <p class="subtitle">지금의 홈 화면이 만들어지기까지 거쳐온 버전들</p>
    </header>

    <div class="layout-grid">
      <nav class="record-menu">
        <button
          v-for="record in records"
          :key="record.key"
          type="button"
          class="menu-item"
          :class="{ active: record.key === selectedKey }"
          @click="selectTab(record.key)"
        >
          {{ record.label }}
        </button>
      </nav>

      <div class="record-content">
        <p class="record-content-title">{{ selectedRecord.title }}</p>
        <component :is="selectedRecord.component" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.archive-page {
  max-width: 1140px;
  margin: 0 auto;
  padding: 24px;
}

.archive-header {
  text-align: center;
  margin-bottom: 24px;
}

.archive-header h2 {
  font-size: 1.8rem;
  margin-bottom: 4px;
}

.subtitle {
  color: var(--color-text);
  opacity: 0.78;
  font-size: 0.9rem;
}

.layout-grid {
  display: grid;
  grid-template-columns: 160px 1fr;
  gap: 20px;
  align-items: start;
}

.record-menu {
  position: sticky;
  top: 76px;
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding: 8px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-background-soft);
}

.menu-item {
  padding: 8px 14px;
  border: none;
  border-radius: 999px;
  background: transparent;
  color: var(--color-text);
  font-size: 0.9rem;
  opacity: 0.85;
  text-align: center;
  cursor: pointer;
  transition:
    background 0.15s ease,
    opacity 0.15s ease;
}

.menu-item:hover {
  background: var(--color-background-mute);
  opacity: 1;
}

.menu-item.active {
  background: linear-gradient(120deg, #ff8a5c, #ff5e8e);
  color: #fff;
  opacity: 1;
  font-weight: 600;
}

.record-content {
  min-width: 0;
}

.record-content-title {
  font-size: 0.85rem;
  opacity: 0.7;
  margin-bottom: 12px;
}

@media (max-width: 620px) {
  .layout-grid {
    grid-template-columns: 1fr;
  }

  .record-menu {
    position: static;
    flex-direction: row;
    flex-wrap: wrap;
  }

  .menu-item {
    flex: 1;
    min-width: 80px;
  }
}
</style>
