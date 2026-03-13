import { australianCities } from '../data/mockData'

function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max)
}

function uvLevel(uvIndex) {
  if (uvIndex <= 2) return 'Low'
  if (uvIndex <= 5) return 'Moderate'
  if (uvIndex <= 7) return 'High'
  if (uvIndex <= 10) return 'Very High'
  return 'Extreme'
}

function recommendationForUv(uvIndex) {
  if (uvIndex <= 2) return 'Low risk. Sunglasses are still recommended in bright conditions.'
  if (uvIndex <= 5) return 'Moderate risk. Use SPF 30+ and protective clothing for prolonged exposure.'
  if (uvIndex <= 7) return 'High risk. Seek shade from 10am to 3pm and use SPF 50+.'
  if (uvIndex <= 10) return 'Very high risk. Limit outdoor time and wear full sun-protective gear.'
  return 'Extreme risk. Avoid direct sun where possible and protect all exposed skin.'
}

function computeDeterministicUv(lat, lon) {
  const base = Math.abs(Math.sin(lat * 0.13) * 7) + Math.abs(Math.cos(lon * 0.09) * 6)
  return Number(clamp(base, 1, 12).toFixed(1))
}

export async function getUvByCoordinates(lat, lon) {
  await new Promise((resolve) => setTimeout(resolve, 300))
  const uvIndex = computeDeterministicUv(lat, lon)

  return {
    uvIndex,
    level: uvLevel(uvIndex),
    recommendation: recommendationForUv(uvIndex)
  }
}

export async function getUvByCityAndPostcode(cityName, postcode) {
  const city = australianCities.find((item) => item.name === cityName)
  if (!city) {
    throw new Error('City not found in mock dataset.')
  }

  const postcodeBias = postcode ? Number(postcode.slice(-1)) / 10 : 0
  const uvData = await getUvByCoordinates(city.lat, city.lon)

  return {
    ...uvData,
    uvIndex: Number(clamp(uvData.uvIndex + postcodeBias, 1, 12).toFixed(1))
  }
}

export function getUvThemeClass(uvIndex) {
  if (uvIndex <= 2) return 'uv-low'
  if (uvIndex <= 5) return 'uv-moderate'
  if (uvIndex <= 7) return 'uv-high'
  if (uvIndex <= 10) return 'uv-very-high'
  return 'uv-extreme'
}
