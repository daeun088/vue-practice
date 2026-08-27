# Weather UI Library (Vuetify)

코드: [`WeatherVuetifyView.vue`](../../views/WeatherVuetifyView.vue) (`/weather-vuetify`), [`WeatherVuetifyDetailView.vue`](../../views/WeatherVuetifyDetailView.vue) (`/weather-vuetify/:cityId`), [`plugins/vuetify.js`](../../plugins/vuetify.js)

## 과제 요구사항

- 외부 UI Library를 선정하여 자유롭게 적용
- 실제 OpenWeatherMap 날씨 데이터 적용, 추가 OWM API, 기타 외부 API로 기능 확장

## 구현

기존 구현한 대시보드 화면 원본은 유지하고, `/weather-vuetify` 페이지를 추가하였다. 데이터(`services/`, `cities.js`, `getOutfitCategory`, `configStore`, `favoritesStore`)는 Axios/Pinia 실습에서 구현한 코드를 재사용하였다.

처음엔 `v-app` + `v-container` + `v-row/v-col` + Material 색상 카드로 페이지 전체를 새로 만들었는데, 기존 화면과 톤앤매너가 통일되지 않아 정리하였다.

### Vuetify 적용

- **목록(`WeatherVuetifyView.vue`)** - 단위 전환 `v-btn-toggle`(`configStore.unit`에 직접 `v-model`) 사용
- **상세(`WeatherVuetifyDetailView.vue`)** — 별도 라우트(`/weather-vuetify/:cityId`)로 이동, `v-card`/`v-list`/`v-chip`/`v-progress-circular`로 구성

## 배운 점

Vuetify 컴포넌트는 `<template #append>`, `#prepend`처럼 이름 있는 슬롯을 여러 개 사용한다. 기존 컴포넌트인 `BaseDashboardCard.vue`의 경우 `<slot />` 하나뿐인 기본 슬롯만 썼는데, Vuetify는 prepend/append/title/subtitle 등 한 컴포넌트 안에 slot이 다양하게 설정할 수 있고 각각 이름으로 지정해서 추가하는 방식이라 초기 문법이 낯설었다.

결론적으로 외부 라이브러리를 쓰면 비슷한 UI를 빠르게 확장할 수 있다는 장점이 있지만, 각 컴포넌트가 어떤 슬롯 또는 prop을 제공하는지 미리 알아야 효과적으로 활용할 수 있다는 점을 느꼈다.
