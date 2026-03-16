<script setup>
import { onMounted, ref } from 'vue'
import PageNav from './components/PageNav.vue'
import PasswordGate from './components/PasswordGate.vue'
import AwarenessPage from './pages/AwarenessPage.vue'
import HomePage from './pages/HomePage.vue'
import RiskCalculatorPage from './pages/RiskCalculatorPage.vue'

const activePage = ref('home')
const unlocked = ref(false)

const PASSWORD_SESSION_KEY = 'sunsafe-password-unlocked'
const expectedPassword = import.meta.env.VITE_SITE_PASSWORD || 'sunsafe2026'

function unlockSite() {
  unlocked.value = true
  sessionStorage.setItem(PASSWORD_SESSION_KEY, 'true')
}

onMounted(() => {
  unlocked.value = sessionStorage.getItem(PASSWORD_SESSION_KEY) === 'true'
})
</script>

<template>
  <PasswordGate v-if="!unlocked" :expected-password="expectedPassword" @unlocked="unlockSite" />

  <div v-else class="app-shell">
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
