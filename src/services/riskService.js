import { fitzpatrickTones } from '../data/mockData'

export async function getSkinToneOptions() {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return fitzpatrickTones
}

export async function getRiskGuidanceByTone(toneId) {
  await new Promise((resolve) => setTimeout(resolve, 140))
  const tone = fitzpatrickTones.find((item) => item.id === toneId)

  if (!tone) {
    throw new Error('Skin tone not found in mock dataset.')
  }

  return {
    toneId: tone.id,
    title: `${tone.label} personalised guidance`,
    description: tone.guidance,
    preventiveActions: [
      'Apply broad-spectrum SPF 50+ 20 minutes before sun exposure.',
      'Wear a wide-brimmed hat, protective clothing, and UV-rated sunglasses.',
      'Limit direct exposure during peak UV periods.'
    ]
  }
}
