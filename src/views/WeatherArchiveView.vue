<script setup>
const records = [
  {
    to: '/weather-mockup',
    label: 'Day1',
    title: 'Weather Mockup',
    desc: 'v-for / v-if / 이벤트 수식어로 처음 만든 날씨 카드',
  },
  {
    to: '/weather-composition',
    label: 'Day2',
    title: 'Weather Composition',
    desc: 'computed / watch / watchEffect로 검색·정렬 추가',
  },
  {
    to: '/weather-dashboard',
    label: 'Day3',
    title: 'Weather Dashboard',
    desc: '같은 화면을 기능 변경 없이 컴포넌트 단위로 분리',
  },
  {
    to: '/weather-vuetify',
    label: 'Vuetify',
    title: 'Weather Vuetify',
    desc: '외부 UI 라이브러리(Vuetify)를 부분 적용해본 버전',
  },
]
</script>

<template>
  <div class="archive-page">
    <header class="archive-header">
      <h2>🗂️ 지난 기록</h2>
      <p class="subtitle">지금의 홈 화면이 만들어지기까지 거쳐온 버전들</p>
    </header>

    <div class="layout-grid">
      <ul class="record-info-list">
        <li v-for="record in records" :key="record.to">
          <h3>{{ record.label }} · {{ record.title }}</h3>
          <p>{{ record.desc }}</p>
        </li>
      </ul>

      <nav class="record-menu">
        <RouterLink v-for="record in records" :key="record.to" :to="record.to" class="menu-item">
          {{ record.label }}
        </RouterLink>
      </nav>
    </div>
  </div>
</template>

<style scoped>
.archive-page {
  max-width: 900px;
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
  grid-template-columns: 1fr 160px;
  gap: 20px;
  align-items: start;
}

.record-info-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.record-info-list li {
  padding: 16px 20px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-background-soft);
}

.record-info-list h3 {
  font-size: 1.05rem;
  margin-bottom: 4px;
}

.record-info-list p {
  font-size: 0.85rem;
  opacity: 0.85;
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
  border-radius: 999px;
  color: var(--color-text);
  text-decoration: none;
  font-size: 0.9rem;
  opacity: 0.85;
  text-align: center;
  transition:
    background 0.15s ease,
    opacity 0.15s ease;
}

.menu-item:hover {
  background: var(--color-background-mute);
  opacity: 1;
}

.menu-item.router-link-active {
  background: linear-gradient(120deg, #ff8a5c, #ff5e8e);
  color: #fff;
  opacity: 1;
  font-weight: 600;
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
