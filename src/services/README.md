# Weather Axios

코드: [`weatherApi.js`](./weatherApi.js), [`holidayApi.js`](./holidayApi.js), [`cities.js`](../components/exercise/cities.js)

## 과제 요구사항

1. Axios 라이브러리 설치
2. OpenWeatherMap 가입 및 Key 발급
3. OpenWeatherMap API로 실제 날씨 데이터 가져와서 적용
4. OpenWeatherMap 추가 API로 기능 확장 — 5 Day / 3 Hour Forecast
5. 기타 외부 API로 기능 확장 — 공공데이터포털 특일 정보(공휴일) API

## 구현

- 기존 `weatherData.js`의 mock `mockCities`/`findCityById`는 지우고, `cities.js`에 4개 도시의 위경도만 남겨서 그걸로 OpenWeatherMap을 호출
- `weatherApi.js` — `fetchCurrentWeather`, `fetchCurrentWeatherList`(홈/즐겨찾기용), `fetchForecast`(상세 페이지 5일 예보용)
- `holidayApi.js` — 이번 달 공휴일 목록, 홈 화면 상단에 표시
- `getOutfitCategory`(온도 → 옷차림 추천)는 그대로 재사용 — API가 주는 `temp`가 이미 섭씨 숫자라 로직 변경 없음
- 401 등 API 실패 시 메시지를 구분해서 보여주고 `console.error`로 로그도 남김

## 겪은 문제

- **OWM 키 401** — 발급 직후라 활성화가 안 된 상태였음. `curl`로 직접 호출해봐도 401이 떠서 코드 문제가 아니라 키 쪽 문제라는 걸 확인. 시간 지나니 해결.
- **공공데이터포털 키 이중 인코딩** — 발급받은 서비스키 자체가 이미 URL 인코딩(`%2B`, `%3D%3D` 포함)돼 있어서, axios `params`에 그냥 넣으면 한 번 더 인코딩되어 인증이 깨짐. `serviceKey`만 쿼리스트링에 직접 붙이고 나머지 파라미터만 `URLSearchParams`로 인코딩하는 식으로 우회.
- **공공데이터포털 응답 형태** — 공휴일이 1건일 때 `items.item`이 배열이 아니라 객체 하나로 옴. 배열/객체 둘 다 처리하도록 정규화.
- **`lang=kr` 번역이 어색함** — OWM이 주는 한국어 설명이 "온흐림", "튼구름"처럼 실제 기상청 용어랑 다르지만 원문으로 사용

## API 키

`.env`(gitignore 처리됨)에 `VITE_OPENWEATHER_API_KEY`, `VITE_HOLIDAY_API_KEY` 저장. `.env.example`에 키 형식만 남겨둠.
