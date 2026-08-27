<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="about-page">
    <h2>ℹ️ 서비스 소개</h2>
    <p>
      <strong>오늘 뭐 입지?</strong>는 도시별 실시간(모의) 기상 정보를 기반으로
      오늘의 옷차림을 추천해주는 날씨 대시보드 서비스입니다.
    </p>
    <p>
      원하는 도시를 검색하고, 카드를 눌러 상세 관측 정보를 확인해보세요.
      즐겨찾기 기능으로 자주 확인하는 도시를 빠르게 찾을 수도 있어요.
    </p>
    <button class="home-btn" @click="goHome">🏠 메인 대시보드로 돌아가기</button>
  </div>
</template>

<style scoped>
.about-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 24px;
  text-align: center;
}

.about-page h2 {
  font-size: 1.6rem;
  margin-bottom: 16px;
}

.about-page p {
  opacity: 0.92;
  line-height: 1.6;
  margin-bottom: 12px;
}

.home-btn {
  margin-top: 20px;
  border: 1px solid var(--color-border);
  background: var(--color-background-soft);
  color: var(--color-text);
  border-radius: 999px;
  padding: 10px 20px;
  cursor: pointer;
}

.home-btn:hover {
  border-color: #ff6a3d;
}
</style>
