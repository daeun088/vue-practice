# 오늘뭐입지

도시별 날씨를 보고 오늘의 코디를 추천받는 Vue 3 연습 프로젝트. Day1(v-for/v-if)부터 배포까지 한 저장소 안에서 단계별로 쌓아올렸다.

- 배포: https://vue-practice-opal.vercel.app/
- 스택: Vue 3 (`<script setup>`), Vue Router, Pinia, Axios, Vuetify, Vite

## 실행 방법

```bash
npm install
cp .env.example .env   # VITE_OPENWEATHER_API_KEY, VITE_HOLIDAY_API_KEY 채워넣기
npm run dev
```

`npm run build`로 빌드, `npm run lint`로 ESLint/oxlint 검사.

## 문서 구조

과제별로 코드가 있는 폴더 옆에 상세 README를 뒀다. 이 파일은 전체를 훑어보는 허브고, 각 항목의 트러블슈팅/설계 노트는 링크된 파일에 더 자세히 있다.

```
README.md                         ← 지금 이 파일 (허브)
src/
├── components/
│   ├── weather/README.md         ← Day1~3
│   └── vuetify/README.md         ← UI Library
├── stores/README.md              ← Pinia
├── services/README.md            ← Axios
└── views/README.md               ← Router
```

---

## 과제 1 - Weather Mockup

코드: `src/components/weather/WeatherMockup.vue` (`/weather`)

1. 배열 렌더링 (v-for)

- 임의의 날씨 데이터 배열을 활용해 화면에 날씨 카드를 반복 출력한다.
  const weatherList = ref([
  { id: 'city_01'
  , name: '서울'
  { id: 'city_02'
  , name: '수원'
  { id: 'city_03'
  , name: '부산'
  , temp: 28, status: '맑음' },
  , temp: 24, status: '비' },
  , temp: 26, status: '구름' },
  ])
- :key에 id 바인딩 필수

2. 조건부 렌더링 (v-if)

- 기온이 25도 이상인 도시는"🔥 더움 (25도 이상)", 25도 미만인 도시는"❄️ 선선함 (25도
  미만)" 라벨을 붙인다. (조건은 다르게 해도 된다.)

3. 양방향 바인딩 및 한글 처리 (:value, @input)

- 도시 이름을 한글로 검색하는 input을 만든 후 한글 입력 후 입력 한 도시명을 출력한다.

4. 이벤트 및 수식어

- 지역별 날씨 현황 카드를 누르면 상태바에“{도시}이 선택되었습니다.” 표기
- 지역별 날씨 현황 카드 내부의 [상세보기] 버튼을 누르면 버블링 없이 해당 도시의 날씨 내
  용을 window.alert로 띄운다.
  const showDetail = (cityName, status) => {
  window.alert(`${cityName}의 현재 날씨는 [${status}] 상태입니다.`)
  }

5. 본인만의 데이터를 추가하고 이를 기초로 Mockup을 추가한다.

## 과제 2 - Weather Composition

코드: `src/components/weather/WeatherComposition.vue` (`/weather-composition`)

과제 요구사항

1. 반응형 상태 관리: 검색어(searchQuery), 선택된 도시(selectedCityInfo), 그리고 지역별 날씨
   데이터 배열(weatherList)을 반응형 상태로 정의. (1일차 동일)
2. 검색 도시 (computed 활용): 전체 날씨 리스트 중에서 사용자가 입력한 검색어가 도시 이름
   에 포함된 항목만 필터링하여 Computed 배열에 담아 놓는다. (filteredWeatherList)
3. 반응형 변수 변화 감시 (watch, watchEffect):

- selectedCityInfo 감시 (watch 이용): 상태바 문구가 바뀔때 마다 콘솔로그를 작성
- searchQuery 감시 (watchEffect 이용):
  도시 검색어를 타이핑할 때 마다 변하는 searchQuery를 추적하여 콘솔로그로 작성

4. 검색 결과 표시 (Template 영역)

- 검색어가 비었을 때는 원본 데이트를 출력
- 검색어와 일치하는 데이터가 있을 때는 해당 데이터 출력
- 검색어와 일치하는 데이터가 없으면 검색 결과가 일치하는 도시가 없다고 안내

5. 본인만의 반응형 상태 변수, Computed, Watcher를 추가한다.

## 과제 3 - Weather Component Vue Components

코드: `src/components/weather/` (`/weather-dashboard`)

- `WeatherParent.vue`
- `BaseDashboardCard.vue`
- `SearchBar.vue`
- `WeatherCard.vue`
- `SortControls.vue`, `OutfitHeroPanel.vue` (본인 추가 컴포넌트)

▪ 과제 요구사항 : 기능 변경없이 4개의 Component 파일로 분리

1. WeatherParent.vue

- 모든 반응형 데이터 유지

2. BaseDashboardCard.vue

- 검색박스와 리스트박스의 디자인을 공통화.
- <slot> 배치하여 부모 컴포넌트가 도시 검색, 날씨 현황 주입

3. SearchBar.vue

- 부모로 부터 검색도시 반응형 데이터를 전달받아 표시 (props)
- 도시 검색 시 update-query 이벤트를 발생하면서 검색어를 부모에게 전달 (emits)

4. WeatheCard.vue

- 선택된 도시 객체를 전달 받아 표시 (props)
- 카드를 선택하는 것(select-card 이벤트)과 상세보기(click-detail 이벤트)를 부모에게 전달
  (emits)

5. 6. 각 컴포넌트로 분리하면서 Component에 해당되는 디자인은 <style scoped>로 각각 분리
      [참고] Slot으로 전달되는 자식 컴포넌트(SearchBar, WeatherCard)는 시각적으로는
      BaseDashboardCard 내부에 위치하지만, 스크립트적으로는 부모 컴포넌트의 스코프에서 컴파
      일되고 평가되므로, WeatherParent에서 SearchBar와 WeatherCard와 직접 바인딩/통신이 가능
      하다.
6. 본인의 Mockup 부분에서 추가로 Component하거나 위의 Component를 더 분리하여 추가
   Component를 만든다.

### 중점적으로 생각한 것 / 트러블슈팅 (자세히: [weather/README.md](src/components/weather/README.md))

- Day1/Day2는 컴포넌트 분리를 배우기 전이라 카드 마크업을 각 파일에 의도적으로 인라인 중복시킴
- 조사(이/가) 자동 선택, `click`/`dblclick` 이벤트 충돌 등 디테일한 UX 이슈를 다잡는 데 신경 씀
- watch/watchEffect 결과를 디버그용 모니터 박스 대신 토스트 + "오늘의 코디 추천" 히어로 패널로 노출해 실제 서비스 화면처럼 보이게 함
- Day1/Day2를 한 페이지로 합쳤다가, 과제가 누적식이라는 걸 뒤늦게 확인하고 다시 분리하는 등 스펙 해석 실수를 여러 번 바로잡음

## 과제 4 - Weather Router

코드: `src/router/index.js`, `src/views/`, `src/components/exercise/` (`/`)

프로젝트 폴더 트리

```
src/
├── main.js               # 라우터 인스턴스 전역 주입 (.use(router))
├── App.vue                # 내비게이션 바 (<RouterLink>) 및 메인 수문장 (<RouterView />) 배치
├── router/
│   └── index.js           # 라우트 규칙(routes 배열) 정의 및 Lazy Loading 설정
├── components/
│   └── exercise/           # ⭐ 실습용 부품 컴포넌트 격리 폴더
│       ├── BaseDashboardCard.vue
│       ├── SearchBar.vue
│       └── WeatherCard.vue
└── views/                  # 페이지 단위 컴포넌트 보관 폴더
    ├── WeatherHomeView.vue     # 메인 날씨 대시보드 화면
    ├── WeatherAboutView.vue    # 서비스 소개용 정적 페이지
    ├── WeatherDetailView.vue   # :cityId 패턴을 수신하는 동적 상세 페이지
    └── NotFoundView.vue        # 정의되지 않은 경로 접근 시 (Catch-all Route)
```

▪ 과제 요구사항

1. Vue Router 설정: 라우터 지연 로딩 적용, Catch-all Route 적용
2. App.vue: Navigation Bar 추가 (RouterLink) 및 메인 콘텐츠 영역 배치 (RouterView)
3. WeatherHomeView.vue: WeatherParent 대체 (WeatherParent를 참고하여 / 경로에 맞게 작성)

- 상세보기 버튼 클릭 시 window.alert()를 제거하고, Programmatic Navigation 처리 (router.push('/weather/' + id))

4. WeatherDetailView.vue: 지역별 상세 기상관측 정보를 보여주는 페이지

- 도시 코드에 해당하는 Mock Data를 임시로 활용
- Router 동적 경로 매칭에 해당되는 도시ID (cityId)를 기반으로 Mount 시점에 Mock Data에서 도시 객체 선택

5. WeatherAboutView.vue: 적당한 내용 작성 및 메인 대시보드로 돌아가기 작성
6. 상기 정의된 view 이외에 본인의 추가 view 를 작성하고 Routing 한다.

- `WeatherFavoritesView.vue` (`/weather/favorites`): localStorage에 저장된 즐겨찾기 도시만 모아 보여주는 페이지

### 중점적으로 생각한 것 / 트러블슈팅 (자세히: [views/README.md](src/views/README.md))

- Lazy Loading에서 `component: () => import(...)`처럼 화살표 함수로 감싸지 않으면, `import()`가 라우터 세팅 시점에 즉시 실행돼버려서 사실상 즉시 로딩이 되어버리는 함정이 있음
- Vue Router 4부터 catch-all 문법이 `path: '*'` → `path: '/:pathMatch(.*)*'`로 바뀐 것, 그리고 정적/동적 라우트 선언 순서를 방어적으로 정리한 이유

## 과제 5 - Weather Store Pinia

▪ 날씨 단위를 세팅하는 stores/configStore.js 작성
▪ 과제 요구사항

1. UnitToggler.vue : 대시보드 상단에 배치되어 단위 설정을 변경하는 UI 버튼과 영역
2. Navigation Bar 옆에 UnitToggler.vue 배치
3. 메인과 상세 날씨에 단위 설정 변경 적용
   (참고) 메인/상세 날씨에 단위 설정을 변경을 적용할 경우 유사한 코드가 중복됨 →
   Composable 로 해결 가능함 (범위 제외)
4. 본인만의 추가 Store를 작성하고 활용하거나, configStore에서 state, getter, action을 추가
   한다

### 중점적으로 생각한 것 / 트러블슈팅 (자세히: [stores/README.md](src/stores/README.md))

- 온도 판정 로직(카드 배경색 `is-hot`, 코디 추천)은 항상 원본 섭씨값 기준으로 두고, 화씨 변환값은 화면 표시에만 쓰도록 분리 — 안 그러면 화씨로 전환 시 25도 이상 판정 같은 임계값 로직이 다 깨짐
- `WeatherHomeView.vue`/`WeatherFavoritesView.vue`에 거의 똑같이 중복돼있던 즐겨찾기 localStorage 로직을 `favoritesStore`(본인 추가 Store)로 통합

## 과제 6 - Weather Axios Axios

▪ Axios 활용 준비

1. Axios 라이브러리 설치
2. OpenWeatherMap API 가입 및 Key 발급
   ▪ 과제 요구사항
3. OpenWeatherMap API를 통해 실제 날씨 데이터를 가져와 적용한다.
4. OpenWeatherMap에서 제공되는 API를 추가하여 Application 기능을 확장한다.
5. 기타 외부 API를 추가하여 Application 기능을 확장한다.

### 중점적으로 생각한 것 / 트러블슈팅 (자세히: [services/README.md](src/services/README.md))

- OpenWeatherMap 키가 발급 직후라 401이 났던 걸, `curl`로 직접 호출해봐서 코드 문제가 아니라 키 활성화 대기 문제라는 걸 먼저 확인하고 넘어감
- 공공데이터포털(공휴일 API) 서비스키가 이미 URL 인코딩된 상태로 발급돼서, axios `params`에 그냥 넣으면 이중 인코딩되어 인증이 깨지는 문제를 쿼리스트링 직접 조립으로 우회
- 응답이 1건일 때 `items.item`이 배열이 아니라 객체로 오는 공공데이터포털 특유의 형태를 정규화

## 과제 7 - Weather UI Library

▪ 외부 UI Library를 선정하고 3일차 과제에 외부 UI Library를 자유롭게 적용해 본다.

1. OpenWeatherMap API를 통해 실제 날씨 데이터를 가져와 적용한다.
2. OpenWeatherMap에서 제공되는 API를 추가하여 Application 기능을 확장한다.
3. 기타 외부 API를 추가하여 Application 기능을 확장한다.

### 중점적으로 생각한 것 / 트러블슈팅 (자세히: [components/vuetify/README.md](src/components/vuetify/README.md))

- 처음엔 `v-app`+`v-container`+Material 색상 카드로 페이지 전체를 새로 만들었는데, 기존 화면과 톤이 안 맞아서 카드는 기존 `WeatherCard.vue`를 재사용하고 Vuetify는 `v-btn-toggle`/`v-dialog`/`v-card` 등 꼭 필요한 곳에만 최소로 적용하는 쪽으로 다시 정리
- Vuetify 컴포넌트가 `#prepend`/`#append` 같은 이름 있는 슬롯을 여러 개 쓰는 방식이 직접 만든 `BaseDashboardCard`(기본 슬롯 하나)와 달라서, 슬롯/prop을 미리 파악해야 하는 학습 비용이 있다는 걸 체감

## 과제 8 - Weather Deployment

▪ Source Code 품질관리

1. ESLint로 점검하여 제출 과제의 Error를 없도록 한다.
2. API 키는 환경 변수로 조정하고 Git에 업로드 되지 않도록 한다.
   ▪ Build & Deployment
3. Project를 Build 한다.
4. Build 된 정적파일들을 본인의 서버에 Hosting 한 후 확인한다.

### 중점적으로 생각한 것 / 트러블슈팅

- ESLint/oxlint 에러 0개, `npm run build` 성공까지 매번 다시 확인하고 커밋하는 걸 습관화
- `.env`는 처음부터 `.gitignore`에 추가해두고, 커밋 히스토리 전체(`git log --all -p`)를 검색해서 API 키 값이 한 번도 올라간 적 없는지 직접 검증
- Vercel은 GitHub 연동 배포라 CLI 로그인을 대신 못 해줘서, 빌드 확인 + `.env.example` 정리 + 안내까지만 처리하고 실제 계정 연결/환경변수 등록은 사용자가 진행
- Vite는 `import.meta.env` 값을 빌드 시점에 번들에 박아 넣기 때문에, Vercel 프로젝트 설정에 `VITE_OPENWEATHER_API_KEY`/`VITE_HOLIDAY_API_KEY`를 등록 안 하면 로컬에선 되던 API 호출이 배포본에서만 401로 깨짐
- vue-router `createWebHistory`(SPA) + 정적 호스팅 조합이라, `/weather/seoul`처럼 깊은 경로를 새로고침하면 404가 나는 문제를 `vercel.json`의 rewrite 규칙으로 미리 방지

---

## 포트폴리오 다듬기

과제 8개를 다 끝낸 뒤, 배포한 걸 보니 허전해서 자유롭게 손본 것들. 특정 과제 번호에 안 묶이는 작업이라 여기 별도 섹션으로 정리.

코드: [`App.vue`](src/App.vue), [`WeatherArchiveView.vue`](src/views/WeatherArchiveView.vue), [`WeatherHomeView.vue`](src/views/WeatherHomeView.vue), [`WeatherVuetifyView.vue`](src/views/WeatherVuetifyView.vue), [`cities.js`](src/components/exercise/cities.js), [`weatherData.js`](src/components/exercise/weatherData.js)

### 한 것

- 도시 4개 → 11개 확장 (`cities.js`에 위경도만 추가하면 되는 구조라 간단)
- 온도만 보던 코디 추천에 비/바람 반영 — `getAccessories()`로 "☂️ 우산 필수" / "🧣 바람막이 추천" 배지 추가, 홈에 상시 "코디 가이드" 섹션
- 헤더 리브랜딩 — Vue 기본 초록(#42b883) 걷어내고 로고 이미지 + 그라데이션 워드마크로 교체, nav를 홈/즐겨찾기/소개/기록 4개로 정리
- 홈/Vuetify 페이지를 좌(공휴일+코디가이드) : 우(검색+카드) = 2:3 레이아웃으로 변경
- `/archive`(기록) 페이지 — Day1~3 + Vuetify를 한 페이지에서 왼쪽 메뉴로 전환
- 즐겨찾기 페이지에 "즐겨찾기 요약"(코디별 개수, 우산 필요 개수) 카드 추가

### 트러블슈팅

- **"기록" 페이지 요구사항을 세 번 고쳐 이해함** — 처음엔 카드 클릭 → 라우팅으로 만들었다가, "라우팅 말고 메뉴바로"라는 말에 우측 앵커 스크롤 메뉴로 바꿨다가, 최종적으로는 "카드 자체를 없애고 좌측 메뉴 클릭 시 그 컴포넌트가 그 자리에서 뜨는" 구조라는 걸 확인. `<component :is="selectedRecord.component">`로 `WeatherMockup`/`WeatherComposition`/`WeatherParent`/`WeatherVuetifyView`를 직접 갈아끼우는 방식으로 구현 — URL은 계속 `/archive`에 고정.
- **임베드된 Vuetify 상세 페이지의 "뒤로가기"가 기록 페이지를 탈출함** — `WeatherVuetifyDetailView.vue`가 원래 독립 페이지(`/weather-vuetify`)용으로 만들어져서 "뒤로가기"가 `router.push('/weather-vuetify')`로 하드코딩돼있었음. `/archive`에서 이 컴포넌트를 그대로 재사용하다 보니, 상세 페이지 들어갔다 나올 때 항상 독립 페이지로 튀어버림. `router.push(고정 경로)` 대신 `router.back()`(브라우저 히스토리)으로 바꿔서, 어디서 들어왔든 원래 있던 곳으로 돌아가도록 수정.
- **뒤로가기는 고쳤는데 이번엔 메뉴 선택 상태가 초기화됨** — `router.back()`으로 `/archive`에 돌아오면 `WeatherArchiveView`가 다시 마운트되면서 `selectedKey`(로컬 `ref`)가 Day1로 리셋됨. 선택 상태를 컴포넌트 로컬이 아니라 **쿼리 파라미터**(`/archive?tab=vuetify`)로 옮겨서 해결 — 브라우저 히스토리 자체에 상태가 실려있어서 뒤로가기해도 그대로 복원됨.
- **로고 이미지가 1.3MB** — 32px로 보여줄 로고인데 원본이 1536×1024 PNG라 그대로 쓰기엔 낭비. ImageMagick이 안 깔려있어서 PowerShell `System.Drawing`으로 256px 폭으로 리사이즈(1.3MB → 40KB). 알파 채널(투명 배경) 유지되는지 픽셀 직접 샘플링해서 확인 후 진행.
- **"로고 바꾸고 싶다"가 헤더 로고가 아니라 파비콘이었음** — 헤더의 브랜드 마크를 먼저 바꿨는데, 실제로 원한 건 브라우저 탭 아이콘. `public/favicon.ico`(Vue 기본 파비콘)를 지우고 `public/favicon.png`로 교체, `index.html`의 `<link rel="icon">`도 갱신.
- **우산 배지 때문에 카드 높이가 들쭉날쭉해짐** — 배지가 1개인 카드와 2개인 카드가 섞여서 그리드 안에서 카드 높이가 안 맞았음. 배지들을 `flex-wrap` 한 줄로 묶고, `.weather-card`를 flex column + 버튼에 `margin-top: auto`를 줘서 배지 개수와 무관하게 버튼이 항상 카드 하단에 정렬되도록 수정.
