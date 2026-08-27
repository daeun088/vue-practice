const OUTFIT_CATEGORIES = {
  hot: { emoji: '👕', label: '반팔 + 반바지', range: '28°C 이상' },
  mild: { emoji: '👔', label: '얇은 셔츠 + 가디건', range: '23~27°C' },
  cool: { emoji: '🧶', label: '니트 + 자켓', range: '17~22°C' },
  cold: { emoji: '🧥', label: '코트 / 패딩', range: '17°C 미만' },
}

export function getOutfitCategory(temp) {
  if (temp >= 28) return { key: 'hot', ...OUTFIT_CATEGORIES.hot }
  if (temp >= 23) return { key: 'mild', ...OUTFIT_CATEGORIES.mild }
  if (temp >= 17) return { key: 'cool', ...OUTFIT_CATEGORIES.cool }
  return { key: 'cold', ...OUTFIT_CATEGORIES.cold }
}

export const OUTFIT_GUIDE = Object.entries(OUTFIT_CATEGORIES).map(([key, value]) => ({
  key,
  ...value,
}))

const RAIN_CONDITIONS = ['Thunderstorm', 'Drizzle', 'Rain', 'Snow']
const WINDY_THRESHOLD = 4 // m/s

export function getAccessories({ conditionMain, windSpeed }) {
  const accessories = []
  if (RAIN_CONDITIONS.includes(conditionMain)) {
    accessories.push({ emoji: '☂️', label: '우산 필수' })
  }
  if (windSpeed >= WINDY_THRESHOLD) {
    accessories.push({ emoji: '🧣', label: '바람막이 추천' })
  }
  return accessories
}
