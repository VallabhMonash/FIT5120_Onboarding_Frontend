<script setup>
import { ref } from 'vue'
import PageNav from './components/PageNav.vue'
import AwarenessPage from './pages/AwarenessPage.vue'
import HomePage from './pages/HomePage.vue'
import RiskCalculatorPage from './pages/RiskCalculatorPage.vue'

const activePage = ref('home')
</script>

<template>
  <div class="app-shell">
    <header class="hero">
      <p class="hero-kicker">SunSafe AU</p>
      <h1>Personalised UV risk and prevention guidance</h1>
      <p>
        Static frontend prototype aligned with location permission flow, awareness content, and skin-tone based education.
      </p>
    </header>

    <PageNav v-model="activePage" />

    <main>
      <HomePage v-if="activePage === 'home'" />
      <AwarenessPage v-else-if="activePage === 'awareness'" />
      <RiskCalculatorPage v-else />
    </main>
  </div>
</template>
