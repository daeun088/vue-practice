import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'weather-favorite-city-ids'

function loadFavoriteIds() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return new Set(saved)
  } catch {
    return new Set()
  }
}

export const useFavoritesStore = defineStore('favorites', () => {
  const favoriteCityIds = ref(loadFavoriteIds())

  const isFavorite = computed(() => (cityId) => favoriteCityIds.value.has(cityId))

  function toggleFavorite(cityId) {
    const next = new Set(favoriteCityIds.value)
    if (next.has(cityId)) {
      next.delete(cityId)
    } else {
      next.add(cityId)
    }
    favoriteCityIds.value = next
  }

  watch(favoriteCityIds, (ids) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]))
  })

  return { favoriteCityIds, isFavorite, toggleFavorite }
})
