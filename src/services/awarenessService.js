import { heatTrendSeriesData, mythCards, skinCancerTrendData } from '../data/mockData'
import { getJson } from './apiClient'

function toNumber(value, fallback = 0) {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

export async function getMythCards() {
  try {
    const rows = await getJson('/api/v1/content/myth-cards')
    return rows.map((row, index) => ({
      id: row.id ?? row.myth_id ?? index + 1,
      title: row.title ?? `Myth ${index + 1}`,
      explanation: row.explanation ?? row.explaination ?? row.myth_text ?? '',
    }))
  } catch (error) {
    console.warn('Myth API unavailable, using mock data.')
    await new Promise((resolve) => setTimeout(resolve, 120))
    return mythCards
  }
}

export async function getSkinCancerTrend() {
  try {
    const rows = await getJson('/api/v1/viz/skin-cancer-trend')
    return rows.map((row) => ({
      year: String(row.year),
      cases: toNumber(row.cases),
    }))
  } catch (error) {
    console.warn('Skin trend API unavailable, using mock data.')
    await new Promise((resolve) => setTimeout(resolve, 180))
    return skinCancerTrendData
  }
}

export async function getHeatTrend() {
  try {
    const rows = await getJson('/api/v1/viz/heat-trend-series')
    const transformed = rows
      .map((row) => ({
        year: toNumber(row.year),
        region: row.region ?? row.city,
        avgUv: toNumber(row.avg_uv ?? row.average_uv_index),
      }))
      .filter((row) => row.year && row.region)

    if (!transformed.length) {
      throw new Error('No heat trend rows returned.')
    }

    return transformed
  } catch (error) {
    console.warn('Heat trend API unavailable, using mock data.')
    await new Promise((resolve) => setTimeout(resolve, 180))
    return heatTrendSeriesData
  }
}
