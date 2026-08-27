import axios from 'axios'

const ENCODED_SERVICE_KEY = import.meta.env.VITE_HOLIDAY_API_KEY
const BASE_URL = 'https://apis.data.go.kr/B090041/openapi/service/SpcdeInfoService/getRestDeInfo'

function toItemArray(body) {
  const items = body?.items
  if (!items || items === '') return []
  const item = items.item
  if (!item) return []
  return Array.isArray(item) ? item : [item]
}

export async function fetchHolidays({ year, month }) {
  const query = new URLSearchParams({
    solYear: String(year),
    solMonth: String(month).padStart(2, '0'),
    numOfRows: '30',
    _type: 'json',
  })
  const url = `${BASE_URL}?serviceKey=${ENCODED_SERVICE_KEY}&${query.toString()}`

  const { data } = await axios.get(url)
  const body = data?.response?.body

  return toItemArray(body).map((item) => ({
    date: String(item.locdate),
    name: item.dateName,
    isHoliday: item.isHoliday === 'Y',
  }))
}
