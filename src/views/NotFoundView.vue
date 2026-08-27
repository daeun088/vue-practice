<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

const goHome = () => {
  router.push('/')
}
</script>

<template>
  <div class="not-found-page">
    <p class="code">404</p>
    <h2>페이지를 찾을 수 없습니다</h2>
    <p class="desc">요청하신 주소가 존재하지 않거나 이동되었을 수 있어요.</p>
    <button class="home-btn" @click="goHome">🏠 홈으로 돌아가기</button>
  </div>
</template>

<style scoped>
.not-found-page {
  max-width: 500px;
  margin: 80px auto;
  padding: 24px;
  text-align: center;
}

.code {
  font-size: 4rem;
  font-weight: 700;
  color: #4a7fe0;
  margin-bottom: 8px;
}

.not-found-page h2 {
  font-size: 1.4rem;
  margin-bottom: 8px;
}

.desc {
  opacity: 0.85;
  margin-bottom: 20px;
}

.home-btn {
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
