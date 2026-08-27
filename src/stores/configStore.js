import { ref, computed, watch } from 'vue'
import { defineStore } from 'pinia'

const STORAGE_KEY = 'weather-unit'
const VALID_UNITS = ['celsius', 'fahrenheit']

function loadUnit() {
  const saved = localStorage.getItem(STORAGE_KEY)
  return VALID_UNITS.includes(saved) ? saved : 'celsius'
}

export const useConfigStore = defineStore('config', () => {
  const unit = ref(loadUnit())

  const isFahrenheit = computed(() => unit.value === 'fahrenheit')
  const unitSymbol = computed(() => (isFahrenheit.value ? '°F' : '°C'))

  const convertTemp = computed(() => (celsius) => {
    if (typeof celsius !== 'number') return celsius
    return isFahrenheit.value ? Math.round(celsius * 1.8 + 32) : Math.round(celsius)
  })

  function setUnit(nextUnit) {
    if (!VALID_UNITS.includes(nextUnit)) return
    unit.value = nextUnit
  }

  function toggleUnit() {
    unit.value = isFahrenheit.value ? 'celsius' : 'fahrenheit'
  }

  watch(unit, (value) => {
    localStorage.setItem(STORAGE_KEY, value)
  })

  return { unit, isFahrenheit, unitSymbol, convertTemp, setUnit, toggleUnit }
})
