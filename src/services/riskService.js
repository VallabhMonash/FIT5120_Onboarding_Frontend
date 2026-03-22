import { fitzpatrickTones } from '../data/mockData'
import { getJson } from './apiClient'

let toneCache = null

function getTailoredActions(tone) {
  const id = String(tone.id || '').toUpperCase()
  const risk = String(tone.riskLevel || '').toLowerCase()

  const byTone = {
    I: [
      'Reapply SPF 50+ every 2 hours and after sweating, swimming, or towel drying.',
      'Limit direct sun between 10am-4pm and prioritise UPF clothing, broad hats, and sunglasses.'
    ],
    II: [
      'Use SPF 50+ daily and reapply every 2 hours during outdoor activity.',
      'Plan outdoor tasks for lower-UV periods and use shade whenever possible.'
    ],
    III: [
      'Use broad-spectrum SPF 30+ to SPF 50+ and reapply every 2 hours outdoors.',
      'For extended outdoor time, add a hat and protective clothing to reduce cumulative UV dose.'
    ],
    IV: [
      'Use SPF 30+ on exposed skin, especially face, neck, and hands, even when tanning easily.',
      'On high-UV days, combine sunscreen with shade breaks and sunglasses.'
    ],
    V: [
      'Apply SPF 30+ to uncovered areas because UV damage can occur without visible burning.',
      'Monitor new or changing skin spots and keep routine sun protection habits year-round.'
    ],
    VI: [
      'Use SPF 30+ on exposed areas to reduce long-term UV effects including pigmentation changes.',
      'Pair sunscreen with regular skin checks and protective accessories on high-UV days.'
    ]
  }

  if (byTone[id]) {
    return byTone[id]
  }

  if (risk.includes('very high') || risk.includes('high')) {
    return [
      'Reapply high-SPF sunscreen every 2 hours and minimise direct midday sun exposure.',
      'Use layered protection: shade, long sleeves, hat, and sunglasses during peak UV.'
    ]
  }

  if (risk.includes('moderate')) {
    return [
      'Use SPF 30+ to SPF 50+ and reapply during longer outdoor periods.',
      'Add protective clothing and seek shade when UV levels are elevated.'
    ]
  }

  return [
    'Use daily SPF on exposed skin to reduce cumulative UV damage over time.',
    'Maintain prevention habits and check skin changes regularly.'
  ]
}

function getTailoredEducation(tone) {
  const id = String(tone.id || '').toUpperCase()

  const byTone = {
    I: 'Type I skin has very low natural UV tolerance and tends to burn quickly with minimal tanning. This means short UV exposure can still cause damage, so strict daily protection and midday sun avoidance are especially important.',
    II: 'Type II skin usually burns before tanning, so repeated unprotected exposure can build cumulative UV damage over time. Consistent SPF 50+, protective clothing, and shade during peak UV are key habits.',
    III: 'Type III skin can tan gradually but may still burn under strong UV. Tanning does not prevent DNA damage, so regular sunscreen reapplication and planned shade breaks are important for long-term skin health.',
    IV: 'Type IV skin often tans more easily and burns less often, but UV still contributes to pigmentation issues, photoaging, and skin cancer risk. Daily sun protection remains important, especially on high-UV days.',
    V: 'Type V skin has more melanin and a lower immediate burn risk, but this can hide ongoing UV damage. Consistent sun protection helps reduce long-term skin changes and supports earlier detection of abnormalities.',
    VI: 'Type VI skin rarely burns, but UV exposure can still cause cellular damage, uneven pigmentation, and delayed diagnosis risk. Routine protection and regular skin awareness checks remain essential.'
  }

  return (
    byTone[id] ||
    'Each Fitzpatrick skin tone responds differently to UV, but all tones benefit from sunscreen, shade, and protective clothing to reduce cumulative skin damage.'
  )
}

function getResearchSources() {
  return [
    {
      title: 'Cancer Council Australia: Sun safety',
      url: 'https://www.cancer.org.au/cancer-information/causes-and-prevention/sun-safety'
    },
    {
      title: 'World Health Organization: Ultraviolet (UV) radiation (Q&A)',
      url: 'https://www.who.int/news-room/questions-and-answers/item/radiation-ultraviolet-(uv)-radiation'
    },
    {
      title: 'American Academy of Dermatology: How to prevent skin cancer',
      url: 'https://www.aad.org/public/diseases/skin-cancer/prevent/how'
    },
    {
      title: 'Skin Cancer Foundation: Prevention guidelines',
      url: 'https://www.skincancer.org/skin-cancer-prevention/'
    },
    {
      title: 'Skin Cancer Foundation: UV radiation risk factors',
      url: 'https://www.skincancer.org/risk-factors/uv-radiation/'
    },
    {
      title: 'CDC: Sun safety',
      url: 'https://www.cdc.gov/skin-cancer/sun-safety/index.html'
    },
    {
      title: 'Cancer Council Australia: Understanding UV index',
      url: 'https://www.cancer.org.au/cancer-information/causes-and-prevention/sun-safety/uv-index'
    }
  ]
}

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

  const [actionTwo, actionThree] = getTailoredActions(tone)

  return {
    toneId: tone.id,
    title: `${tone.label} personalised guidance (${tone.riskLevel} risk)`,
    description: tone.recommendation,
    education: getTailoredEducation(tone),
    preventiveActions: [
      tone.recommendation,
      actionTwo,
      actionThree
    ],
    sources: getResearchSources()
  }
}
