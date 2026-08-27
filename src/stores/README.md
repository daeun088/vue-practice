# Weather Store Pinia

기존 Day4(Router) 구조 위에 Pinia store를 얹는 과제. `components/weather/`의 옛 스냅샷들은 건드리지 않고, 실제로 서비스 중인 `/`(WeatherHomeView), `/weather/:cityId`(WeatherDetailView), `/weather/favorites`(WeatherFavoritesView)에 적용했다.

코드: [`configStore.js`](./configStore.js), [`favoritesStore.js`](./favoritesStore.js), [`UnitToggler.vue`](../components/exercise/UnitToggler.vue), [`App.vue`](../App.vue), [`WeatherCard.vue`](../components/exercise/WeatherCard.vue), [`WeatherHomeView.vue`](../views/WeatherHomeView.vue), [`WeatherDetailView.vue`](../views/WeatherDetailView.vue), [`WeatherFavoritesView.vue`](../views/WeatherFavoritesView.vue)

## 과제 요구사항

1. `UnitToggler.vue` — 대시보드 상단에 배치되어 단위 설정을 변경하는 UI 버튼과 영역
2. Navigation Bar 옆에 `UnitToggler.vue` 배치
3. 메인과 상세 날씨에 단위 설정 변경 적용
4. 본인만의 추가 Store를 작성하고 활용하거나, `configStore`에서 state/getter/action을 추가한다

## 구현 내용

### configStore.js

- state: `unit` (`'celsius' | 'fahrenheit'`, 기본값 `celsius`)
- getter: `isFahrenheit`, `unitSymbol`(°C/°F), `convertTemp(celsius)` — 원본 섭씨값을 받아 현재 단위에 맞게 변환하는 함수형 getter
- action: `setUnit(unit)`, `toggleUnit()`
- `watch(unit, ...)`로 localStorage(`weather-unit`)에 저장하고, store 생성 시 `loadUnit()`으로 복원 — 새로고침해도 단위 설정 유지

### favoritesStore.js (본인 추가 Store)

- state: `favoriteCityIds` (Set)
- getter: `isFavorite(cityId)`
- action: `toggleFavorite(cityId)`
- 마찬가지로 `watch` + localStorage(`weather-favorite-city-ids`)로 영속화

### UnitToggler.vue

- °C / °F 버튼 2개, 현재 단위를 강조 표시. 클릭 시 `configStore.setUnit()` 호출. `App.vue`의 nav 옆에 배치.

### 단위 적용 지점

- `WeatherCard.vue`(홈/즐겨찾기 공용 카드), `WeatherDetailView.vue`(상세 페이지) 양쪽에서 `configStore.convertTemp(city.temp)` + `configStore.unitSymbol`로 표시값만 교체했다. 두 곳 다 같은 store를 구독하므로, 어디서 단위를 바꾸든 전체 화면에 즉시 반영된다.

## 트러블슈팅 / 설계 노트

1. **온도 임계값 판정에 변환된 값을 쓰면 로직이 깨짐** — `WeatherCard.vue`의 `is-hot` 클래스(주황/파랑 배경 분기)와 `weatherData.js`의 `getOutfitCategory(temp)`는 전부 **섭씨 기준**으로 하드코딩된 임계값(`temp >= 25`, `temp >= 28` 등)을 쓴다. 화씨로 전환한 뒤 `displayTemp`(예: 82°F)를 그대로 이 판정 함수들에 넘기면 25 이상 조건이 다 깨진다. → 판정용 값(`city.temp`, 원본 섭씨)과 표시용 값(`configStore.convertTemp(city.temp)`)을 명확히 분리해서, 템플릿에서 배경색/코디 계산에는 항상 `city.temp`를, 화면에 찍는 숫자에만 변환값을 쓰도록 했다.
2. **즐겨찾기 로직이 두 View에 독립적으로 중복돼 있었음** — 원래 `WeatherHomeView.vue`와 `WeatherFavoritesView.vue`가 각자 `ref(new Set())` + `onMounted`에서 localStorage를 읽고 + 각자 `toggleFavorite`에서 localStorage에 쓰는 구조였다. 컴포넌트 로컬 상태라 "진실 공급원"이 파일 개수만큼 여러 개 존재하는 셈이었고, 로직도 두 파일에서 거의 한 글자도 다르지 않게 중복돼 있었다. → `favoritesStore`로 옮겨서 단일 상태로 통합, 두 View는 store를 구독만 하도록 정리.
3. **localStorage 초기화를 `onMounted`에서 store 생성 시점으로 이동** — 기존 컴포넌트 코드는 "컴포넌트가 마운트될 때" localStorage를 읽었지만, Pinia store로 옮기면서는 store 팩토리 함수(`defineStore(() => {...})`)가 실행되는 시점, 즉 앱에서 해당 store를 처음 `use...Store()`한 순간에 동기적으로 `loadUnit()`/`loadFavoriteIds()`를 호출해 값을 채운다. store는 앱 전역에 한 번만 생성되므로 `onMounted` 훅 자체가 필요 없어졌다.
4. **localStorage 값이 오염된 경우 방어** — `configStore.js`의 `VALID_UNITS`로 `loadUnit()`이 읽어온 값이 `'celsius'`/`'fahrenheit'`가 아니면(저장 이력이 없거나, 값이 손상된 경우) 기본값 `celsius`로 폴백하고, `setUnit()`도 유효하지 않은 값이 들어오면 무시하도록 했다.
5. **동작 확인** — `node_modules`가 설치돼 있지 않아 `npm ci`로 먼저 설치, Vite dev 서버를 띄우고 Playwright로 직접 브라우저를 구동해 확인했다. °F 전환 시 홈/즐겨찾기/상세 페이지 전부 즉시 반영되고, 즐겨찾기 상태도 페이지 이동 후 유지되는 것을 스크린샷으로 확인, 콘솔 에러 없음.
