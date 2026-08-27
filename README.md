# 오늘뭐입지

도시별 날씨를 보고 오늘의 코디를 추천받는 Vue 3 프로젝트.

- 배포: https://vue-practice-opal.vercel.app/
- 스택: Vue 3 (`<script setup>`), Vue Router, Pinia, Axios, Vuetify, Vite

## 실행 방법

```bash
npm install
cp .env.example .env   # VITE_OPENWEATHER_API_KEY, VITE_HOLIDAY_API_KEY 추가
npm run dev
```

`npm run build` 빌드, `npm run lint`로 ESLint/oxlint 검사.

## 폴더 구조

```
src/
├── components/
│   ├── weather/      # Mockup/Composition/Dashboard
│   ├── exercise/      # 본 화면 사용 컴포넌트 검색바, 카드, 도시 목록 등
│   └── vuetify/      # Vuetify 상세 페이지 컴포넌트
├── views/            # 라우트 매핑 페이지 (홈/상세/즐겨찾기/소개/기록/Day1~3/Vuetify)
├── stores/           # Pinia — 단위 설정, 즐겨찾기
├── services/         # Axios — OpenWeatherMap, 공공데이터포털 공휴일 API 호출
├── router/           # 라우트 정의
└── plugins/          # Vuetify 초기화
```

---

## 1. Weather Mockup

코드: `src/components/weather/WeatherMockup.vue` (`/weather`)

`weatherList` 배열을 `v-for`로 순회해 카드를 출력하고(`:key="id"`), 기온 25도를 기준으로 `v-if`/`v-else`로 "🔥 더움"/"❄️ 선선함" 배지를 붙였다. 도시 검색 input은 `v-model` 대신 `:value`+`@input`으로 직접 양방향 바인딩을 구현했다. 카드 클릭 시 상태바에 문구를 표시하고, `[상세보기]` 버튼은 `@click.stop`으로 버블링을 막은 뒤 `window.alert`로 날씨 정보를 띄운다.

## 2. Weather Composition

코드: `src/components/weather/WeatherComposition.vue` (`/weather-composition`)

`searchQuery`, `selectedCityInfo`, `weatherList`를 반응형 상태로 두고, `computed`로 검색어에 맞는 도시만 걸러내는 `filteredWeatherList`를 구현했다. `watch(selectedCityInfo)`로 상태바 문구가 바뀔 때마다, `watchEffect`로 검색어가 바뀔 때마다 콘솔에 로그를 남긴다. 또한, 추가 기능으로 온도 오름차순/내림차순 정렬과 온도를 기반으로 코디 매핑 기능을 구현했다.

## 3. Weather Component Vue Components

코드: `src/components/weather/` (`/weather-dashboard`)

- `WeatherParent.vue`
- `BaseDashboardCard.vue`
- `SearchBar.vue`
- `WeatherCard.vue`
- `SortControls.vue`, `OutfitHeroPanel.vue` (본인 추가 컴포넌트)

기능 변경없이 4개의 Component 파일로 분리했다. 해당 과정에서 컴포넌트를 어떤 단위로 분리하는 것이 좋을지에 대해 고민했다. `WeatherParent.vue`가 반응형 데이터를 갖고, `BaseDashboardCard.vue`는 `<slot>` 하나로 검색 영역/카드 리스트 영역을 가질 수 있도록 공통화했다. `SearchBar.vue`는 `update-query` emit으로, `WeatherCard.vue`는 `select-card`/`click-detail` emit으로 부모와 연결된다.

### 트러블슈팅

- Day1/Day2는 컴포넌트 분리를 배우기 전이라 카드 마크업을 각 파일에 의도적으로 인라인 중복시켰다.
- 조사(이/가) 자동 선택, `click`/`dblclick` 이벤트 충돌 을 고려하였다.
- watch/watchEffect 결과를 디버그용 모니터 박스 대신 토스트 + "오늘의 코디 추천" 히어로 패널로 노출해 실제 서비스 화면처럼 보이도록 구현했다.

## 4. Weather Router

코드: `src/router/index.js`, `src/views/`, `src/components/exercise/` (`/`)

프로젝트 폴더 트리

```
src/
├── main.js               # 라우터 인스턴스 전역 주입 (.use(router))
├── App.vue                # 내비게이션 바 (<RouterLink>) 및 메인 수문장 (<RouterView />) 배치
├── router/
│   └── index.js           # 라우트 규칙 정의 및 Lazy Loading 설정
├── components/
│   └── exercise/           # 컴포넌트 폴더
│       ├── BaseDashboardCard.vue
│       ├── SearchBar.vue
│       └── WeatherCard.vue
└── views/                  # 페이지 단위 컴포넌트 보관 폴더
    ├── WeatherHomeView.vue     # 메인 날씨 대시보드 화면
    ├── WeatherAboutView.vue    # 서비스 소개용 정적 페이지
    ├── WeatherDetailView.vue   # :cityId 패턴을 수신하는 동적 상세 페이지
    └── NotFoundView.vue        # 정의되지 않은 경로 접근 시 (Catch-all Route)
```

모든 라우트를 `component: () => import(...)`로 지연 로딩했고, `WeatherHomeView.vue`는 상세보기 클릭 시 `window.alert` 대신 `router.push('/weather/' + id)`로 이동하도록 했다. `WeatherDetailView.vue`는 동적 경로 `cityId`를 기준으로 도시 정보를 조회하고, 추가 페이지로 `WeatherFavoritesView.vue`(`/weather/favorites`)를 만들어 즐겨찾기 도시만 모아 보여준다.

### 트러블슈팅

- Lazy Loading에서 `component: () => import(...)`처럼 화살표 함수로 감싸지 않으면, `import()`가 라우터 세팅 시점에 즉시 실행되어 로딩이 된다는 것을 확인하였다.

## 5. Weather Store Pinia

▪ 날씨 단위를 세팅하는 stores/configStore.js 작성. `UnitToggler.vue`를 대시보드 상단/Navigation Bar 옆에 배치해 메인·상세 화면의 단위 설정에 적용하고, 추가 Store를 만든다.

`configStore.js`는 `unit`(celsius/fahrenheit) state와 `unitSymbol`, `convertTemp()` getter, `setUnit()`/`toggleUnit()` action을 가지며 localStorage로 영속화된다. 추가 Store로 `favoritesStore.js`를 만들어 즐겨찾기 상태를 관리한다.

### 트러블슈팅

- 온도 판정 로직은 항상 원본 섭씨값 기준으로 두고, 화씨 변환값은 화면 표시에만 쓰도록 분리하였다.
- `WeatherHomeView.vue`, `WeatherFavoritesView.vue`에 중복돼있던 즐겨찾기 localStorage 로직을 `favoritesStore`로 통합하였다.

## 6. Weather Axios Axios

▪ Axios 활용. OpenWeatherMap API로 실제 날씨 데이터를 가져와 적용하고, 추가 OWM API와 기타 외부 API로 기능을 확장한다.

`weatherApi.js`로 현재 날씨(`fetchCurrentWeather`)와 5일/3시간 예보(`fetchForecast`)를, `holidayApi.js`로 공공데이터포털 공휴일 정보를 가져온다. 기존 mock 데이터(`mockCities`)는 지우고 `cities.js`의 위경도만으로 실시간 데이터를 조회하도록 바꿨다.

### 트러블슈팅

- OpenWeatherMap 키가 발급 직후 401에러가 발생했다. 이를 해결하고자 `curl`로 직접 호출한 결과, 키 활성화에 따른 대기 문제라는 것을 확인했다. 이후 에러 발생 시 예외 처리를 추가하였다.
- 공공데이터포털(공휴일 API) 서비스키가 URL 인코딩된 상태로 발급이 되어 axios `params`에 넣을 경우, 이중 인코딩되어 인증이 깨지는 문제가 발생했다. 이에 따라 쿼리스트링을 직접 조립하는 방향으로 수정하였다.
- 공공데이터포털 데이터의 경우 응답이 1건일 때 `items.item`이 배열이 아니라 객체로 오는 것을 확인하여 형태를 정규화했다.

## 7. Weather UI Library

▪ 외부 UI Library를 선정하고 3일차 과제에 외부 UI Library를 자유롭게 적용. 실제 날씨 데이터 적용, 추가 OWM API, 기타 외부 API로 기능을 확장한다.

목록 페이지(`WeatherVuetifyView.vue`, `/weather-vuetify`)는 단위 전환에 `v-btn-toggle`을, 상세 페이지(`WeatherVuetifyDetailView.vue`, `/weather-vuetify/:cityId`)는 `v-card`/`v-list`/`v-chip`으로 구성했다. 데이터는 Axios/Pinia 과제에서 만든 `services/`, `configStore`, `favoritesStore`를 그대로 재사용했다.

### 트러블슈팅

- vuetify를 사용하며 `v-app`+`v-container`+Material 색상 카드로 페이지 전체를 새로 구성하였다. 하지만 기존 화면과 톤이 안 맞아서 카드는 기존 `WeatherCard.vue`를 재사용하고 Vuetify는 `v-btn-toggle`/`v-dialog`/`v-card` 등에 적용하는 방향으로 다시 정리했다.
- Vuetify 컴포넌트가 `#prepend`/`#append` 같은 이름 있는 슬롯을 여러 개 쓰는 방식이 기존에 구현한 기본 슬롯이 하나인 `BaseDashboardCard`와 달라서, 슬롯/prop을 미리 파악해야 더욱 효율적으로 구현할 수 있다는 것을 체감했다.

## 8. Weather Deployment

▪ Source Code 품질관리 — ESLint로 에러를 없애고, API 키를 환경 변수로 분리해 Git에 올라가지 않게 한다. Build & Deployment — 프로젝트를 빌드하고, 빌드된 정적 파일을 본인의 서버에 호스팅해서 확인한다.

`npm run lint`(oxlint+eslint) 에러 0개, `npm run build` 성공을 확인했다. `.env`는 `.gitignore`에 등록해 커밋된 적이 없다. `vercel.json`으로 SPA 라우팅 rewrite를 설정하고 Vercel에 배포했다.

### 트러블슈팅

- `.env`는 처음부터 `.gitignore`에 추가해두고, 커밋 히스토리 전체에서 API 키 값이 올라간 적 없는지 검증하였다.
- Vite는 `import.meta.env` 값을 빌드 시점에 번들에 넣기 때문에, Vercel 프로젝트 설정에 `VITE_OPENWEATHER_API_KEY`, `VITE_HOLIDAY_API_KEY`를 등록하지 않을 경우 API 호출이 배포본에서 에러가 발생하는 것을 확인했다.
- vue-router `createWebHistory`와 정적 호스팅 조합이기 때문에 `/weather/seoul`처럼 depth가 깊은 url을 새로고침할 경우 404가 발생할 수 있는 문제를 `vercel.json`의 rewrite 규칙으로 미리 방지하였다.

---

## 추가 수정사항

- 도시 4개 → 11개 확장
- 코디 추천에 비/바람을 반영하여 `getAccessories()`를 기반으로 배지를 추가하고 홈에 "코디 가이드" 섹션을 추가하였다.
- 홈/Vuetify 페이지를 2:3 레이아웃으로 변경하였다.

### 트러블슈팅

- **Vuetify 상세 페이지 "뒤로가기" 클릭 시 처리** — `WeatherVuetifyDetailView.vue`는 기존에 독립 페이지로 구현하여 "뒤로가기"가 하드코딩 되어있었다. 이후 `/archive`에서 컴포넌트를 재사용하여상세 페이지 들어갔다 나올 때 항상 독립 페이지로 라우팅되는 문제가 발생했다. 이를 해결하고자 `router.back()`으로 수정하여, 이전 페이지로 돌아가도록 수정했다.
- **뒤로가기 시 메뉴 선택 상태 초기화** — `router.back()`으로 `/archive`에 돌아오면 `WeatherArchiveView`가 다시 마운트되면서 `selectedKey`가 Day1로 리셋되었다. 이는 사용자 경험을 해친다고 생각하여 선택 상태를 쿼리 파라미터로 옮겨서 해결하였다.
