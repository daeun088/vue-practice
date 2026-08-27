export const cities = [
  { id: 'seoul', name: '서울', lat: 37.5665, lon: 126.978 },
  { id: 'suwon', name: '수원', lat: 37.2636, lon: 127.0286 },
  { id: 'busan', name: '부산', lat: 35.1796, lon: 129.0756 },
  { id: 'jeju', name: '제주', lat: 33.4996, lon: 126.5312 },
]

export function findCityMetaById(cityId) {
  return cities.find((city) => city.id === cityId) ?? null
}
