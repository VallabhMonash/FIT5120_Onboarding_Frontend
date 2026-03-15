import { heatTrendSeriesData, mythCards, skinCancerTrendData } from '../data/mockData'

function toNumber(value, fallback = 0) {
  const n = Number(value)
  return Number.isFinite(n) ? n : fallback
}

async function tryGetJson(path) {
  const base = import.meta.env.VITE_API_BASE_URL
  if (!base) return null

  try {
    const response = await fetch(`${base.replace(/\/$/, '')}${path}`)
    if (!response.ok) return null
    return await response.json()
  } catch (error) {
    return null
  }
}

export async function getMythCards() {
  const rows = await tryGetJson('/myth')

  if (rows?.length) {
    return rows.map((row, index) => ({
      id: row.id ?? row.myth_id ?? index + 1,
      title: row.title ?? row.myth_title ?? `Myth ${index + 1}`,
      explanation: row.explanation ?? row.explaination ?? row.myth_text ?? ''
    }))
  }

  await new Promise((resolve) => setTimeout(resolve, 120))
  return mythCards
}

export async function getSkinCancerTrend() {
  const rows = await tryGetJson('/viz')

  if (rows?.length) {
    return rows.map((row) => ({
      year: String(row.year),
      cases: toNumber(row.cases)
    }))
  }

  await new Promise((resolve) => setTimeout(resolve, 180))
  return skinCancerTrendData
}

export async function getHeatTrend() {
  const rows = await tryGetJson('/viz')

  if (rows?.length) {
    const transformed = rows
      .map((row) => ({
        year: toNumber(row.year),
        region: row.region ?? row.city,
        avgUv: toNumber(row.avg_uv ?? row.average_uv_index ?? row.avgHotDays)
      }))
      .filter((row) => row.year && row.region)

    if (transformed.length) {
      return transformed
    }
  }

  await new Promise((resolve) => setTimeout(resolve, 180))
  return heatTrendSeriesData
}
