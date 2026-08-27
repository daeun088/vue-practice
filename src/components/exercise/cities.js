export const cities = [
  { id: 'seoul', name: '서울', lat: 37.5665, lon: 126.978 },
  { id: 'incheon', name: '인천', lat: 37.4563, lon: 126.7052 },
  { id: 'suwon', name: '수원', lat: 37.2636, lon: 127.0286 },
  { id: 'daejeon', name: '대전', lat: 36.3504, lon: 127.3845 },
  { id: 'daegu', name: '대구', lat: 35.8714, lon: 128.6014 },
  { id: 'gwangju', name: '광주', lat: 35.1595, lon: 126.8526 },
  { id: 'ulsan', name: '울산', lat: 35.5384, lon: 129.3114 },
  { id: 'busan', name: '부산', lat: 35.1796, lon: 129.0756 },
  { id: 'jeonju', name: '전주', lat: 35.8242, lon: 127.148 },
  { id: 'gangneung', name: '강릉', lat: 37.7519, lon: 128.8761 },
  { id: 'jeju', name: '제주', lat: 33.4996, lon: 126.5312 },
]

export function findCityMetaById(cityId) {
  return cities.find((city) => city.id === cityId) ?? null
}
