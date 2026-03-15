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
      <h1>Stay UV aware with personalised prevention guidance</h1>
    </header>

    <main class="main-content">
      <HomePage v-if="activePage === 'home'" />
      <AwarenessPage v-else-if="activePage === 'awareness'" />
      <RiskCalculatorPage v-else />
    </main>

    <PageNav v-model="activePage" />
  </div>
</template>
