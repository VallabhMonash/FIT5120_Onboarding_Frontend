export const australianCities = [
  { name: 'Melbourne', region: 'VIC', postcode: '3000', lat: -37.8136, lon: 144.9631 },
  { name: 'Sydney', region: 'NSW', postcode: '2000', lat: -33.8688, lon: 151.2093 },
  { name: 'Brisbane', region: 'QLD', postcode: '4000', lat: -27.4698, lon: 153.0251 },
  { name: 'Perth', region: 'WA', postcode: '6000', lat: -31.9523, lon: 115.8613 },
  { name: 'Adelaide', region: 'SA', postcode: '5000', lat: -34.9285, lon: 138.6007 },
  { name: 'Canberra', region: 'ACT', postcode: '2600', lat: -35.2809, lon: 149.13 },
  { name: 'Hobart', region: 'TAS', postcode: '7000', lat: -42.8821, lon: 147.3272 },
  { name: 'Darwin', region: 'NT', postcode: '0800', lat: -12.4634, lon: 130.8456 }
]

export const mythCards = [
  {
    id: 1,
    title: 'Myth: Dark skin does not need sun protection',
    explanation:
      'All skin tones can be damaged by UV radiation. Melanin provides some protection, but not complete protection against DNA damage and skin cancer risk.'
  },
  {
    id: 2,
    title: 'Myth: You cannot get sun damage on cloudy days',
    explanation:
      'UV rays can pass through clouds. You can still get skin and eye damage even when the day does not feel hot.'
  },
  {
    id: 3,
    title: 'Myth: Sunscreen is only needed at the beach',
    explanation:
      'Daily incidental exposure during commuting, sports, and outdoor work contributes to cumulative UV damage over time.'
  }
]

export const skinCancerTrendData = [
  { year: '2018', cases: 14400 },
  { year: '2019', cases: 14750 },
  { year: '2020', cases: 15020 },
  { year: '2021', cases: 15280 },
  { year: '2022', cases: 15560 },
  { year: '2023', cases: 15810 },
  { year: '2024', cases: 16040 }
]

export const heatTrendData = [
  { region: 'NSW', avgHotDays: 21 },
  { region: 'VIC', avgHotDays: 18 },
  { region: 'QLD', avgHotDays: 29 },
  { region: 'WA', avgHotDays: 26 },
  { region: 'SA', avgHotDays: 24 },
  { region: 'TAS', avgHotDays: 11 },
  { region: 'NT', avgHotDays: 33 }
]

export const fitzpatrickTones = [
  {
    id: 'I',
    label: 'Type I',
    description: 'Very fair skin, often burns, rarely tans',
    guidance: 'High UV sensitivity. Seek shade and reapply SPF 50+ every 2 hours outdoors.'
  },
  {
    id: 'II',
    label: 'Type II',
    description: 'Fair skin, burns easily, tans minimally',
    guidance: 'Elevated UV sensitivity. Use SPF 50+, hat, sunglasses, and long sleeves.'
  },
  {
    id: 'III',
    label: 'Type III',
    description: 'Medium skin, sometimes mild burn, tans gradually',
    guidance: 'Moderate UV sensitivity. Apply broad-spectrum sunscreen and monitor midday UV.'
  },
  {
    id: 'IV',
    label: 'Type IV',
    description: 'Olive skin, rarely burns, tans easily',
    guidance: 'Still at UV risk. Daily sun protection helps reduce long-term skin damage.'
  },
  {
    id: 'V',
    label: 'Type V',
    description: 'Brown skin, very rarely burns',
    guidance: 'Lower burn likelihood but UV harm remains possible. Protect during UV peaks.'
  },
  {
    id: 'VI',
    label: 'Type VI',
    description: 'Dark brown to black skin, almost never burns',
    guidance: 'UV damage can still occur. Use sunscreen and protective clothing in high UV.'
  }
]
