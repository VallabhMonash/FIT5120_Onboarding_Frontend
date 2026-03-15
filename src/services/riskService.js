import { fitzpatrickTones } from '../data/mockData'

const toneRisk = {
  I: 'Very High',
  II: 'High',
  III: 'Moderate',
  IV: 'Moderate',
  V: 'Low',
  VI: 'Low'
}

const guidanceByTone = {
  I: {
    actions: [
      'Avoid direct midday sun and prefer deep shade between 10am and 3pm.',
      'Apply SPF 50+ every 2 hours and after sweating or swimming.',
      'Use UPF-rated long sleeves and broad-brim hats whenever outdoors.'
    ],
    sources: [
      { title: 'WHO: UV Radiation and the INTERSUN Programme', url: 'https://www.who.int/teams/environment-climate-change-and-health/radiation-and-health/uv-radiation' },
      { title: 'Cancer Council: SunSmart Recommendations', url: 'https://www.cancer.org.au/cancer-information/causes-and-prevention/sun-safety' }
    ]
  },
  II: {
    actions: [
      'Use SPF 50+ daily on exposed skin, even on mild or cloudy days.',
      'Limit prolonged outdoor activities during peak UV periods.',
      'Pair sunscreen with sunglasses and protective clothing.'
    ],
    sources: [
      { title: 'American Academy of Dermatology: Sunscreen FAQ', url: 'https://www.aad.org/media/stats-sunscreen' },
      { title: 'Cancer Council: UV Index and Protection Times', url: 'https://www.cancer.org.au/cancer-information/causes-and-prevention/sun-safety/uv-index' }
    ]
  },
  III: {
    actions: [
      'Maintain routine sun protection for sports and commuting exposure.',
      'Reapply sunscreen every two hours during outdoor activities.',
      'Check daily UV index and plan shade breaks in high UV windows.'
    ],
    sources: [
      { title: 'CDC: Sun Safety', url: 'https://www.cdc.gov/cancer/skin/basic_info/sun-safety.htm' },
      { title: 'WHO: Global Solar UV Index Guide', url: 'https://www.who.int/publications/i/item/9241590076' }
    ]
  },
  IV: {
    actions: [
      'Do not rely on tanning response as full protection against UV damage.',
      'Use broad-spectrum sunscreen for extended outdoor work or events.',
      'Monitor skin changes and seek medical review for persistent lesions.'
    ],
    sources: [
      { title: 'Skin Cancer Foundation: Skin of Color', url: 'https://www.skincancer.org/skin-cancer-information/skin-cancer-skin-of-color/' },
      { title: 'PubMed: UV exposure and pigmentation response', url: 'https://pubmed.ncbi.nlm.nih.gov/11100012/' }
    ]
  },
  V: {
    actions: [
      'Keep regular UV protection habits despite lower burn frequency.',
      'Prioritise hats and eyewear for prolonged outdoor activity.',
      'Perform periodic skin self-checks and report unusual spots early.'
    ],
    sources: [
      { title: 'AAD: Skin cancer in skin of color', url: 'https://www.aad.org/public/diseases/skin-cancer/types/common/melanoma/skin-of-color' },
      { title: 'Cancer Research UK: Sun safety for all skin tones', url: 'https://www.cancerresearchuk.org/about-cancer/causes-of-cancer/sun-uv-and-cancer' }
    ]
  },
  VI: {
    actions: [
      'Use sunscreen on frequently exposed areas such as face, neck, and hands.',
      'Do not ignore cumulative UV exposure during daily commuting.',
      'Seek prompt review for evolving pigmented lesions or non-healing patches.'
    ],
    sources: [
      { title: 'JAMA Dermatology: Skin cancer in darker skin types', url: 'https://jamanetwork.com/journals/jamadermatology/fullarticle/422713' },
      { title: 'DermNet: Skin cancer in skin of colour', url: 'https://dermnetnz.org/topics/skin-cancer-in-skin-of-colour' }
    ]
  }
}

export async function getSkinToneOptions() {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return fitzpatrickTones.map((tone) => ({
    ...tone,
    riskLevel: toneRisk[tone.id] ?? 'Unknown'
  }))
}

export async function getRiskGuidanceByTone(toneId) {
  await new Promise((resolve) => setTimeout(resolve, 140))
  const tone = fitzpatrickTones.find((item) => item.id === toneId)

  if (!tone) {
    throw new Error('Skin tone not found in mock dataset.')
  }

  const detail = guidanceByTone[toneId] ?? { actions: [], sources: [] }

  return {
    toneId: tone.id,
    title: `${tone.label} personalised guidance (${toneRisk[tone.id] ?? 'Unknown'} risk)`,
    description: tone.guidance,
    preventiveActions: detail.actions,
    sources: detail.sources
  }
}
