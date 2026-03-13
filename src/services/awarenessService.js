import { heatTrendData, mythCards, skinCancerTrendData } from '../data/mockData'

export async function getMythCards() {
  await new Promise((resolve) => setTimeout(resolve, 120))
  return mythCards
}

export async function getSkinCancerTrend() {
  await new Promise((resolve) => setTimeout(resolve, 180))
  return skinCancerTrendData
}

export async function getHeatTrend() {
  await new Promise((resolve) => setTimeout(resolve, 180))
  return heatTrendData
}
