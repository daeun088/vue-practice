<script setup>
const records = [
  {
    to: '/weather-mockup',
    title: 'Day1 · Weather Mockup',
    desc: 'v-for / v-if / 이벤트 수식어로 처음 만든 날씨 카드',
  },
  {
    to: '/weather-composition',
    title: 'Day2 · Weather Composition',
    desc: 'computed / watch / watchEffect로 검색·정렬 추가',
  },
  {
    to: '/weather-dashboard',
    title: 'Day3 · Weather Dashboard',
    desc: '같은 화면을 기능 변경 없이 컴포넌트 단위로 분리',
  },
  {
    to: '/weather-vuetify',
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

    <div class="record-list">
      <RouterLink v-for="record in records" :key="record.to" :to="record.to" class="record-card">
        <h3>{{ record.title }}</h3>
        <p>{{ record.desc }}</p>
      </RouterLink>
    </div>
  </div>
</template>

<style scoped>
.archive-page {
  max-width: 700px;
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
  opacity: 0.6;
  font-size: 0.9rem;
}

.record-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.record-card {
  display: block;
  padding: 16px 20px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: var(--color-background-soft);
  color: var(--color-text);
  text-decoration: none;
  transition:
    transform 0.15s ease,
    border-color 0.15s ease;
}

.record-card:hover {
  transform: translateX(4px);
  border-color: #ff8a5c;
}

.record-card h3 {
  font-size: 1.05rem;
  margin-bottom: 4px;
}

.record-card p {
  font-size: 0.85rem;
  opacity: 0.7;
}
</style>
