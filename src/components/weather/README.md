# Weather

날씨 카드를 출력하는 과제. 두 페이지로 나눠서 진행한다.

- `/weather` — [WeatherView.vue](../../../views/WeatherView.vue) → `WeatherMockup.vue` (Day1: v-for, v-if, 이벤트/수식어)
- `/weather-composition` — [WeatherCompositionView.vue](../../../views/WeatherCompositionView.vue) → `WeatherComposition.vue` (Day2: computed, watch, watchEffect)

컴포넌트 분리(props/emits)는 아직 배우지 않은 뒷부분 커리큘럼이라, 카드 마크업은 두 파일에 각각 인라인으로 들어있다(의도적인 중복). `WeatherCard.vue`는 컴포넌트 분리를 연습해본 흔적으로 저장소에 남겨뒀지만 지금은 어느 페이지에서도 쓰지 않는다. 온도→코디 매핑([outfit.js](./outfit.js))처럼 컴포넌트가 아닌 순수 함수 모듈은 두 페이지가 그대로 같이 가져다 쓴다.

## 과제 요구사항 (Day1 — v-for/v-if/이벤트)

1. **배열 렌더링 (v-for)** — `weatherList`를 `v-for`로 순회하며 카드를 출력, `:key="city.id"` 바인딩.
2. **조건부 렌더링 (v-if)** — 기온 25도 이상은 "🔥 더움", 미만은 "❄️ 선선함" 배지 표시. (`WeatherMockup.vue`는 원래 스펙 그대로 이 배지를 쓰고, `WeatherComposition.vue`는 옷차림 추천 기능을 얹으면서 배지를 `getOutfitCategory` 결과로 대체함 — 아래 "코디 추천" 섹션 참고)
3. **양방향 바인딩 및 한글 처리 (:value, @input)** — 도시 검색 input을 `v-model` 대신 `:value` + `@input`으로 수동 구현, 입력한 값을 그대로 화면에 echo. (이 단계에서는 카드 필터링까지는 요구하지 않음 — 실제 필터링은 Day2 요구사항)
4. **이벤트 및 수식어**
   - 카드 클릭 → 상태바에 `"{도시}이/가 선택되었습니다."` 표기 (받침 유무에 따라 조사 자동 선택, `getSubjectParticle`)
   - `[상세보기]` 버튼 → `@click.stop`으로 버블링 차단 후 `window.alert`
5. **본인만의 데이터 추가** — `제주` 카드 추가.

## 과제 요구사항 (Day2 — computed/watch/watchEffect, `WeatherComposition.vue`)

1. **반응형 상태 관리** — `searchQuery`, `selectedCityInfo`, `weatherList`를 반응형 상태로 정의.
2. **검색 도시 (computed)** — `filteredWeatherList`가 `searchQuery`로 도시 이름을 필터링. 검색창은 Day1과 마찬가지로 `:value` + `@input`으로 구현하되(별도 페이지라 각자 독립적인 `searchKeyword`/`searchQuery` 상태를 가짐), 여기서는 실제로 그 값이 카드 필터링에 쓰인다.
3. **감시 (watch, watchEffect)**
   - `watch(selectedCityInfo, ...)` — 상태바 문구가 바뀔 때마다 콘솔 로그.
   - `watchEffect(() => ...)` — `searchQuery`가 바뀔 때마다(타이핑할 때마다) 콘솔 로그.
4. **검색 결과 표시** — 검색어가 비었으면 원본 데이터, 일치하는 항목이 있으면 필터링된 데이터, 없으면 안내 문구를 보여준다. `filteredWeatherList`가 검색어 없을 때 원본을 그대로 반환하도록 구현해서, 템플릿에서는 `filteredWeatherList.length > 0` 여부만으로 "데이터 있음/없음" 두 갈래로 자연스럽게 나뉜다 (두 갈래 다 실제로는 정렬까지 적용된 `sortedWeatherList`를 렌더링).
5. **본인만의 상태/computed/watcher** — 정렬 기준 `sortOrder`(반응형 상태) + `sortedWeatherList`(computed, 온도 오름차순/내림차순 정렬) + `watch(sortOrder, ...)`(정렬 기준 변경 로그).

## 코디 추천 확장 (computed/watch 활용 연습)

날씨 데이터 위에 "이 온도엔 이런 옷을 입어라"는 추천 로직을 얹었다. 온도 → 코디 매핑은 [outfit.js](./outfit.js)의 `getOutfitCategory(temp)`에 모아뒀고(카드 배지와 페이지 양쪽에서 재사용), 이걸 기반으로 computed/watch 조합을 하나 더 추가했다.

- **`selectedOutfit`** (computed) — `selectedCityInfo`가 바뀔 때마다 자동으로 재계산되는, "지금 선택된 도시의 추천 코디". 다른 ref에 의존하는 computed 체이닝 예시.
- **카테고리 변경 감지** (watch) — `selectedOutfit`을 그대로 watch하지 않고 `() => selectedOutfit.value?.key`라는 getter를 watch해서, 코디 카테고리가 **실제로 바뀔 때만** 이전값/새값을 비교해 로그를 남긴다. (예: 니트 추천 도시 → 반팔 추천 도시로 이동하면 `"cool → hot"` 로그)
- **우산 필요 여부** (watchEffect) — 선택된 도시가 바뀔 때마다 `status === '비'`인지 자동으로 재확인해서 콘솔에 로그. searchQuery용 watchEffect와 별개로, 하나의 컴포넌트에 watchEffect가 여러 개 동시에 독립적으로 동작할 수 있음을 보여준다.
- **`outfitSummary`** (computed) — `filteredWeatherList` 전체를 순회해서 카테고리별 개수 + 우산 필요한 도시 수를 집계. 지금까지의 computed가 전부 "단일 항목 파생"이었다면, 이건 "배열 → 집계값" 유형이라 다른 성격의 computed 활용 사례.

watch/watchEffect 콜백의 `console.log`는 그대로 다 남아있지만, 화면에는 "watch 모니터링 박스" 같은 디버그용 UI 대신 **실제 서비스 화면처럼 보이는 요소**로 노출한다: 선택된 도시가 바뀌면 상단에 토스트(`statusMessage`, 2초 후 자동 사라짐)가 뜨고, 그 아래 "오늘의 코디 추천" 히어로 패널(`selectedOutfit`/`needsUmbrella` 기반)이 실시간으로 갱신된다. 즉 watch/computed는 여전히 그대로 동작하지만, 그 결과를 사용자에게 자연스러운 UI로 보여주는 방식으로 바꾼 것.

## 추가로 넣어본 이벤트/수식어 (Day1)

같은 카드 안에서 이벤트가 서로 겹치지 않도록 대상을 분리해서 구성했다.

| 대상              | 이벤트                           | 동작                                                  |
| ----------------- | -------------------------------- | ----------------------------------------------------- |
| 카드 전체         | `@click`                         | 카드 선택, 상태바 메시지 표시                         |
| 카드 전체         | `@contextmenu.prevent`           | 브라우저 기본 우클릭 메뉴 대신 즐겨찾기 상태 alert    |
| 별 아이콘 버튼    | `@click.stop`                    | 즐겨찾기(⭐) 토글, 카드 선택과 분리                   |
| 온도 텍스트       | `@click.stop` + `@dblclick.stop` | 더블클릭으로 °C/°F 단위 전환, 클릭 버블링도 함께 차단 |
| 검색 input        | `@keyup.enter`                   | 검색어로 alert 실행                                   |
| 검색 input        | `@keyup.esc`                     | 검색어 초기화                                         |
| 새로고침 버튼     | `@click.once`                    | 최초 1회만 온도 랜덤 갱신                             |
| `[상세보기]` 버튼 | `@click.stop`                    | 버블링 없이 상세 정보 alert                           |

### 겹치는 이벤트 처리 관련 메모

`click`과 `dblclick`을 같은 요소에 걸면, 더블클릭은 항상 `click` 두 번이 먼저 버블링된 뒤 `dblclick`이 발생한다. 따라서 즐겨찾기 토글을 카드 전체의 `dblclick`으로 뒀더니 더블클릭할 때마다 카드 선택도 같이 일어나는 문제가 있었다. 이를 해결하기 위해:

- 즐겨찾기는 **별 아이콘 전용 버튼**의 단일 클릭(`@click.stop`)으로 옮김
- 온도 단위 전환은 **온도 텍스트에만** `@dblclick.stop`을 걸고, 앞서 버블링되는 `click`도 `@click.stop`으로 함께 차단

이렇게 이벤트 대상을 분리하면 하나를 조작할 때 다른 동작이 의도치 않게 같이 발생하지 않는다.

## 트러블슈팅 히스토리

1. **UI가 그리드로 반으로 쪼개져 보임** — 원인은 `src/assets/main.css`에 남아있던 Vue 기본 템플릿용 `@media (min-width:1024px) { #app { display:grid; grid-template-columns: 1fr 1fr } }` 규칙. 원래 헤더+사이드바 2단 레이아웃 전제였는데 지금 구조엔 안 맞아서 넓은 화면에서 콘텐츠가 쪼개짐. → 해당 규칙 및 `App.vue`의 관련 leftover `nav` 스타일 제거/정리로 해결.
2. **검색 중에도 "선택되었습니다" 상태바가 계속 보임** — 검색 중엔 방해되므로 조건을 추가해 검색어가 있을 땐 상태바를 숨김.
3. **조사(이/가) 오류** — "수원이 선택되었습니다"는 맞는데 "제주이 선택되었습니다"처럼 어색한 경우 발생. 마지막 글자의 받침 유무를 유니코드 코드포인트로 계산하는 `getSubjectParticle` 헬퍼를 추가해 도시 이름에 맞는 조사를 자동 선택하도록 수정.
4. **카드 click과 즐겨찾기 dblclick이 같은 요소에서 충돌** — 위 "겹치는 이벤트 처리 관련 메모" 참고. 즐겨찾기를 별 아이콘 버튼(`@click.stop`)으로 분리.
5. **온도 더블클릭 시 카드 선택도 같이 발생** — `dblclick`은 그 전에 `click`이 두 번 버블링된 뒤 발생하는 이벤트라, 온도 텍스트에 `@dblclick.stop`만 걸어뒀을 때도 두 번의 `click`이 먼저 카드까지 버블링되어 선택이 같이 일어남. 온도 텍스트에 `@click.stop`도 함께 추가해 클릭 버블링 자체를 차단해서 해결.
6. **Day1/Day2 페이지를 따로 만들었다가 하나로 병합** — 처음엔 `/weather`(Day1)와 `/weather-composition`(Day2)을 별도 페이지로 만들었는데, 과제가 누적 진행 방식이라 Day2 페이지가 Day1 내용을 전부 포함하고 있어야 한다는 걸 뒤늦게 확인. `WeatherMockup.vue`를 삭제하고 그 안의 Day1 로직(검색 echo, 상세보기 alert, 이벤트 수식어들)을 `WeatherComposition.vue`로 옮겨 `/weather` 한 페이지로 통합했다. 이 과정에서 Day1에 실수로 들어가 있던 "검색어로 카드 필터링" 기능도 발견 — 원래 Day1 스펙은 필터링을 요구하지 않았고, 그건 Day2의 `filteredWeatherList` computed가 담당하는 게 맞아서 정리했다.
7. **"watch 모니터링 박스" UI를 실제 서비스 화면으로 교체** — 처음엔 watch/watchEffect 값을 눈으로 확인하려고 "🐕 watch (selectedCityInfo)" 같은 디버그용 모니터 패널을 화면에 그대로 노출했는데, 실제 사용자 화면이라기엔 어색했다. `console.log`는 그대로 두고, 화면에는 토스트 알림 + "오늘의 코디 추천" 히어로 패널처럼 자연스러운 UI 요소로 결과를 보여주는 방식으로 교체했다.
8. **한 페이지 병합 + 컴포넌트 분리를 다시 두 페이지로 되돌림** — 위 6번에서 Day1/Day2를 한 페이지(`WeatherComposition.vue`)로 합치고 카드 UI도 `WeatherCard.vue` 컴포넌트로 분리했었는데, (a) 과제 자체는 원래 Day1/Day2가 구분되어 있어야 하고 (b) 컴포넌트(props/emits) 분리는 아직 배우지 않은 커리큘럼이라 지금 제출물에 쓰면 안 된다는 걸 확인. `WeatherMockup.vue`를 다시 만들고, 두 파일 모두 카드 마크업을 인라인으로 갖도록 되돌렸다. `WeatherCard.vue` 파일 자체는 지우지 않고 저장소에 남겨뒀다(연습해본 흔적, 나중에 컴포넌트 단원에서 다시 참고용으로 쓸 수 있음).
