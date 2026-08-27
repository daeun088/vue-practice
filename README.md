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