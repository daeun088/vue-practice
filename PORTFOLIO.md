# 포트폴리오 다듬기

과제 6개(Day1~4, Pinia, Axios, UI Library, Deployment)를 다 끝낸 뒤, 배포한 걸 보니 허전해서 자유롭게 손본 기록.

코드: [`App.vue`](src/App.vue), [`WeatherArchiveView.vue`](src/views/WeatherArchiveView.vue), [`WeatherHomeView.vue`](src/views/WeatherHomeView.vue), [`WeatherVuetifyView.vue`](src/views/WeatherVuetifyView.vue), [`cities.js`](src/components/exercise/cities.js), [`weatherData.js`](src/components/exercise/weatherData.js)

## 한 것

- 도시 4개 → 11개 확장 (`cities.js`에 위경도만 추가하면 되는 구조라 간단)
- 온도만 보던 코디 추천에 비/바람 반영 — `getAccessories()`로 "☂️ 우산 필수" / "🧣 바람막이 추천" 배지 추가, 홈에 상시 "코디 가이드" 섹션
- 헤더 리브랜딩 — Vue 기본 초록(#42b883) 걷어내고 로고 이미지 + 그라데이션 워드마크로 교체, nav를 홈/즐겨찾기/소개/기록 4개로 정리
- 홈/Vuetify 페이지를 좌(공휴일+코디가이드) : 우(검색+카드) = 2:3 레이아웃으로 변경
- `/archive`(기록) 페이지 — Day1~3 + Vuetify를 한 페이지에서 왼쪽 메뉴로 전환

## 트러블슈팅

- **"기록" 페이지 요구사항을 세 번 고쳐 이해함** — 처음엔 카드 클릭 → 라우팅으로 만들었다가, "라우팅 말고 메뉴바로"라는 말에 우측 앵커 스크롤 메뉴로 바꿨다가, 최종적으로는 "카드 자체를 없애고 좌측 메뉴 클릭 시 그 컴포넌트가 그 자리에서 뜨는" 구조라는 걸 확인. `<component :is="selectedRecord.component">`로 `WeatherMockup`/`WeatherComposition`/`WeatherParent`/`WeatherVuetifyView`를 직접 갈아끼우는 방식으로 구현 — URL은 계속 `/archive`에 고정.
- **임베드된 Vuetify 상세 페이지의 "뒤로가기"가 기록 페이지를 탈출함** — `WeatherVuetifyDetailView.vue`가 원래 독립 페이지(`/weather-vuetify`)용으로 만들어져서 "뒤로가기"가 `router.push('/weather-vuetify')`로 하드코딩돼있었음. `/archive`에서 이 컴포넌트를 그대로 재사용하다 보니, 상세 페이지 들어갔다 나올 때 항상 독립 페이지로 튀어버림. `router.push(고정 경로)` 대신 `router.back()`(브라우저 히스토리)으로 바꿔서, 어디서 들어왔든 원래 있던 곳으로 돌아가도록 수정.
- **뒤로가기는 고쳤는데 이번엔 메뉴 선택 상태가 초기화됨** — `router.back()`으로 `/archive`에 돌아오면 `WeatherArchiveView`가 다시 마운트되면서 `selectedKey`(로컬 `ref`)가 Day1로 리셋됨. 선택 상태를 컴포넌트 로컬이 아니라 **쿼리 파라미터**(`/archive?tab=vuetify`)로 옮겨서 해결 — 브라우저 히스토리 자체에 상태가 실려있어서 뒤로가기해도 그대로 복원됨.
- **로고 이미지가 1.3MB** — 32px로 보여줄 로고인데 원본이 1536×1024 PNG라 그대로 쓰기엔 낭비. ImageMagick이 안 깔려있어서 PowerShell `System.Drawing`으로 256px 폭으로 리사이즈(1.3MB → 40KB). 알파 채널(투명 배경) 유지되는지 픽셀 직접 샘플링해서 확인 후 진행.
- **"로고 바꾸고 싶다"가 헤더 로고가 아니라 파비콘이었음** — 헤더의 브랜드 마크를 먼저 바꿔줬는데, 실제로 원한 건 브라우저 탭 아이콘. `public/favicon.ico`(Vue 기본 파비콘)를 지우고 `public/favicon.png`로 교체, `index.html`의 `<link rel="icon">`도 갱신.
