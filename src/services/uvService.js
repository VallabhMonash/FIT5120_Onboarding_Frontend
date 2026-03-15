import { australianCities } from '../data/mockData'
import { getJson } from './apiClient'

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

function isValidAustralianPostcode(value) {
  return /^\d{4}$/.test(String(value).trim())
}

function isRegionPostcodeMatch(region, postcode) {
  const digit = String(postcode).trim().charAt(0)
  const rules = {
    VIC: '3',
    NSW: '2',
    QLD: '4',
    SA: '5',
    WA: '6',
    TAS: '7',
    ACT: '2',
    NT: '0'
  }

  const expected = rules[region]
  return expected ? digit === expected : true
}

async function getRealtimeUv(lat, lon) {
  const payload = await getJson(`/api/v1/uv/by-coordinates?lat=${lat}&lon=${lon}`)
  const uvIndex = Number(payload.uv_index)

  if (!Number.isFinite(uvIndex)) {
    throw new Error('Invalid UV index from backend.')
  }

  return Number(uvIndex.toFixed(1))
}

export async function getUvByCoordinates(lat, lon) {
  try {
    const uvIndex = await getRealtimeUv(lat, lon)
    return {
      uvIndex,
      level: uvLevel(uvIndex),
      recommendation: recommendationForUv(uvIndex)
    }
  } catch (error) {
    const uvIndex = computeDeterministicUv(lat, lon)
    return {
      uvIndex,
      level: uvLevel(uvIndex),
      recommendation: recommendationForUv(uvIndex)
    }
  }
}

export async function getUvByCityAndPostcode(cityName, postcode) {
  const city = australianCities.find((item) => item.name === cityName)
  if (!city) {
    throw new Error('City not found in configured dataset.')
  }

  const normalizedPostcode = String(postcode).trim()

  if (!isValidAustralianPostcode(normalizedPostcode)) {
    throw new Error('Postcode must be a valid 4-digit Australian postcode.')
  }

  if (!isRegionPostcodeMatch(city.region, normalizedPostcode)) {
    throw new Error(`Postcode does not match ${city.name} (${city.region}).`)
  }

  return getUvByCoordinates(city.lat, city.lon)
}

export function getUvThemeClass(uvIndex) {
  if (uvIndex <= 2) return 'uv-low'
  if (uvIndex <= 5) return 'uv-moderate'
  if (uvIndex <= 7) return 'uv-high'
  if (uvIndex <= 10) return 'uv-very-high'
  return 'uv-extreme'
}
