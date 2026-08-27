const OUTFIT_CATEGORIES = {
  hot: { emoji: '👕', label: '반팔 + 반바지' },
  mild: { emoji: '👔', label: '얇은 셔츠 + 가디건' },
  cool: { emoji: '🧶', label: '니트 + 자켓' },
  cold: { emoji: '🧥', label: '코트 / 패딩' },
}

export function getOutfitCategory(temp) {
  if (temp >= 28) return { key: 'hot', ...OUTFIT_CATEGORIES.hot }
  if (temp >= 23) return { key: 'mild', ...OUTFIT_CATEGORIES.mild }
  if (temp >= 17) return { key: 'cool', ...OUTFIT_CATEGORIES.cool }
  return { key: 'cold', ...OUTFIT_CATEGORIES.cold }
}

export const WEATHER_ICONS = {
  맑음: '☀️',
  비: '🌧️',
  구름: '☁️',
}

export const mockCities = [
  {
    id: 'seoul',
    name: '서울',
    temp: 28,
    status: '맑음',
    humidity: 55,
    windSpeed: 2.4,
    description: '맑고 화창한 날씨가 이어지고 있어요.',
  },
  {
    id: 'suwon',
    name: '수원',
    temp: 24,
    status: '비',
    humidity: 82,
    windSpeed: 3.1,
    description: '오후부터 비가 내리니 우산을 챙기세요.',
  },
  {
    id: 'busan',
    name: '부산',
    temp: 26,
    status: '구름',
    humidity: 68,
    windSpeed: 4.0,
    description: '구름이 많지만 비 소식은 없어요.',
  },
  {
    id: 'jeju',
    name: '제주',
    temp: 30,
    status: '맑음',
    humidity: 60,
    windSpeed: 5.2,
    description: '한여름 더위가 계속되는 중입니다.',
  },
]

export function findCityById(cityId) {
  return mockCities.find((city) => city.id === cityId) ?? null
}
