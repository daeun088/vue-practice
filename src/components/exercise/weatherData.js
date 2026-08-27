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
