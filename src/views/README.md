# Weather Router

`WeatherParent.vue` 한 컴포넌트에 몰려있던 화면을 Vue Router 기반의 페이지(`views/`)들로 나눈 과제. `components/weather/`의 옛 스냅샷들과는 별개로, 여기서부터가 실제로 `/`에서 서비스되는 최종 구조다.

코드: [`router/index.js`](../router/index.js), [`App.vue`](../App.vue), `views/` 전체, [`components/exercise/`](../components/exercise/)

## 과제 요구사항

1. Vue Router 설정: 라우터 지연 로딩 적용, Catch-all Route 적용
2. `App.vue`: Navigation Bar 추가(`RouterLink`) 및 메인 콘텐츠 영역 배치(`RouterView`)
3. `WeatherHomeView.vue`: `WeatherParent`를 대체 — 상세보기 클릭 시 `window.alert()` 대신 Programmatic Navigation(`router.push('/weather/' + id)`)
4. `WeatherDetailView.vue`: 지역별 상세 기상관측 정보 페이지 — 동적 경로(`cityId`) 기반으로 Mount 시점에 Mock Data에서 도시 객체 선택
5. `WeatherAboutView.vue`: 소개 페이지 + 메인 대시보드로 돌아가기
6. 본인 추가 view — `WeatherFavoritesView.vue`(`/weather/favorites`): localStorage에 저장된 즐겨찾기 도시만 모아 보여주는 페이지

## 구현 내용

- **`router/index.js`** — 모든 라우트를 `component: () => import(...)`로 지연 로딩. `/`, `/weather/about`, `/weather/favorites`, `/weather/:cityId`(동적), `/weather-mockup`·`/weather-composition`·`/weather-dashboard`(Day1~3 스냅샷 라우트), 마지막에 catch-all.
- **`App.vue`** — `<nav>`에 `RouterLink`로 각 페이지 연결, 그 아래 `<RouterView />`로 매칭된 페이지를 렌더링.
- **`WeatherHomeView.vue`** — 검색/카드 리스트를 담당. `[상세보기]` 클릭 시 `router.push('/weather/' + city.id)`로 이동(과거 `window.alert` 방식에서 전환).
- **`WeatherDetailView.vue`** — `useRoute().params.cityId`로 넘어온 도시 ID를 `onMounted`에서 `findCityById`로 조회해 상세 정보 표시. 매칭 실패 시 "해당 도시 정보를 찾을 수 없습니다" 안내.
- **`WeatherAboutView.vue`** — 정적 소개 페이지.
- **`WeatherFavoritesView.vue`** — localStorage 기반 즐겨찾기 목록 페이지(현재는 [`favoritesStore`](../stores/README.md)로 리팩터링됨).
- **`NotFoundView.vue`** — catch-all에 매칭되는 공용 404 페이지.

## 트러블슈팅 / 설계 노트

### 1. Lazy Loading — 반드시 화살표 함수로 감싸야 함

```js
component: () => import('../views/WeatherHomeView.vue')
```

- 여기서 화살표 함수(`() => ...`)가 핵심이다. `import()` 자체는 Promise를 반환하는 **함수 호출**이라, 만약 `component: import('../views/WeatherHomeView.vue')`처럼 화살표 함수 없이 바로 써버리면 그 `import()` 호출이 **`router/index.js` 모듈이 평가되는 즉시**(즉 앱이 라우터를 세팅하는 시점에 바로) 실행돼버린다. 결과적으로 해당 페이지 컴포넌트가 그 라우트로 진입하기도 전에 이미 로드돼있는, 사실상 즉시 로딩(eager loading)이 되어버려서 "지연 로딩"이라는 요구사항 자체가 무의미해진다.
- 화살표 함수로 감싸두면 Vue Router가 **실제로 그 라우트에 진입하는 시점**에야 비로소 `import()`를 호출하기 때문에, 방문하지 않는 페이지의 코드는 아예 다운로드되지 않는다.
- Vite는 이렇게 동적 `import()`로 호출된 모듈을 자동으로 별도 청크(js 파일)로 분리해준다 — webpack처럼 `/* webpackChunkName: "..." */` 매직 코멘트를 따로 달아줄 필요가 없다.
- 확인 방법: 빌드 후(`npm run build`) `dist/assets/`를 보면 `WeatherHomeView-*.js`, `WeatherDetailView-*.js`처럼 view별로 파일이 쪼개져 나오는 걸 볼 수 있다.

### 2. Catch-all 라우트

```js
{
  path: '/:pathMatch(.*)*',
  name: 'not-found',
  component: () => import('../views/NotFoundView.vue'),
}
```

- **문법**: Vue Router 3까지 쓰이던 `path: '*'`는 Vue Router 4부터 더 이상 지원하지 않는다(에러 발생). 대신 "이름 있는 파라미터를 반복 가능하게" 만드는 `:pathMatch(.*)*` 문법을 써야 한다. 뒤에 붙은 `*`가 "이 세그먼트가 0개 이상 반복될 수 있다"는 뜻이라, `/foo`, `/foo/bar`, `/foo/bar/baz`처럼 세그먼트 개수와 무관하게 전부 이 라우트 하나로 흡수된다.
- **위치**: `routes` 배열의 **맨 마지막**에 둔다. Vue Router 4/5는 등록 순서와 무관하게 정적 경로를 동적 경로보다 우선 매칭하도록 자동으로 우선순위(랭킹)를 매기긴 하지만, catch-all은 "다른 어떤 라우트와도 매칭되지 않을 때만 걸려야 하는" 라우트라는 의미 자체가 명확히 드러나도록 관례적으로도 배열 마지막에 선언한다.
- **정적 경로 vs 동적 경로 순서**: 같은 이유로 `/weather/about`, `/weather/favorites`(정적)를 `/weather/:cityId`(동적)보다 먼저 선언해뒀다. 실제로는 Vue Router의 랭킹 알고리즘이 정적 세그먼트를 더 높은 우선순위로 자동 처리해주기 때문에 순서를 바꿔도 `/weather/about`이 `cityId === 'about'`인 상세 페이지로 잘못 매칭되지는 않지만, 선언 순서만 봐도 의도가 읽히도록 정적 라우트를 먼저 배치했다.
- **주의**: `NotFoundView.vue`는 `route.params.pathMatch`(매칭된 실제 경로 조각)를 화면에 쓰지 않고 고정된 "페이지를 찾을 수 없습니다" 문구만 보여준다 — 필요하면 `route.params.pathMatch.join('/')`로 사용자가 시도한 경로를 로그/표시에 활용할 수 있다.
