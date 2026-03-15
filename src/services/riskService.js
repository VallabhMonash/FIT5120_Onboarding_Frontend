import { fitzpatrickTones } from '../data/mockData'
import { getJson } from './apiClient'

let toneCache = null

function normalizeRiskLabel(value) {
  const text = String(value || '').trim().toLowerCase()
  if (!text) return 'Unknown'
  return text.charAt(0).toUpperCase() + text.slice(1)
}

function parseToneId(row, index) {
  const explicit = String(row.id ?? row.skin_tone_id ?? '').trim()
  if (/^(I|II|III|IV|V|VI)$/i.test(explicit)) {
    return explicit.toUpperCase()
  }

  const toneText = String(row.skin_tone ?? row.skin_type ?? '').toUpperCase()
  const match = toneText.match(/\b(I|II|III|IV|V|VI)\b/)
  if (match) {
    return match[1]
  }

  return fitzpatrickTones[index]?.id ?? String(index + 1)
}

function fallbackToneData() {
  return fitzpatrickTones.map((tone) => ({
    id: tone.id,
    label: tone.label,
    riskLevel: 'Unknown',
    description: tone.description,
    recommendation: tone.guidance
  }))
}

function normalizeToneRows(rows) {
  return rows.map((row, index) => ({
    id: parseToneId(row, index),
    label: row.skin_tone ?? row.skin_type ?? `Type ${index + 1}`,
    riskLevel: normalizeRiskLabel(row.risk_level),
    description: row.description ?? row.explanation ?? row.explaination ?? '',
    recommendation: row.recommendation ?? row.protection_advice ?? ''
  }))
}

export async function getSkinToneOptions() {
  try {
    const rows = await getJson('/api/v1/content/skin-tones')
    toneCache = normalizeToneRows(rows)
  } catch (error) {
    console.warn('Skin tone API unavailable, using mock data.')
    toneCache = fallbackToneData()
    await new Promise((resolve) => setTimeout(resolve, 100))
  }

  return toneCache
}

export async function getRiskGuidanceByTone(toneId) {
  if (!toneCache) {
    await getSkinToneOptions()
  }

  const tone = toneCache.find((item) => item.id === String(toneId))
  if (!tone) {
    throw new Error('Skin tone not found in dataset.')
  }

  return {
    toneId: tone.id,
    title: `${tone.label} personalised guidance (${tone.riskLevel} risk)`,
    description: tone.recommendation,
    preventiveActions: [
      tone.recommendation,
      'Apply broad-spectrum sunscreen before outdoor exposure.',
      'Combine sunscreen with shade, clothing, and eyewear.'
    ],
    sources: [
      { title: 'WHO UV Guidance', url: 'https://www.who.int/teams/environment-climate-change-and-health/radiation-and-health/uv-radiation' },
      { title: 'Cancer Council Sun Safety', url: 'https://www.cancer.org.au/cancer-information/causes-and-prevention/sun-safety' }
    ]
  }
}
