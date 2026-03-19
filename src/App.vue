<script setup>
import { onMounted, ref } from 'vue'
import PageNav from './components/PageNav.vue'
import PasswordGate from './components/PasswordGate.vue'
import AwarenessPage from './pages/AwarenessPage.vue'
import HomePage from './pages/HomePage.vue'
import LandingPage from './pages/LandingPage.vue'
import RiskCalculatorPage from './pages/RiskCalculatorPage.vue'

const activePage = ref('landing')
const unlocked = ref(false)

const PASSWORD_SESSION_KEY = 'sunsafe-password-unlocked'
const expectedPassword = import.meta.env.VITE_SITE_PASSWORD || 'sunsafe2026'

function unlockSite() {
  unlocked.value = true
  sessionStorage.setItem(PASSWORD_SESSION_KEY, 'true')
}

function openUvPage() {
  activePage.value = 'uv'
}

function openPage(pageId) {
  activePage.value = pageId
}

onMounted(() => {
  unlocked.value = sessionStorage.getItem(PASSWORD_SESSION_KEY) === 'true'
})
</script>

<template>
  <PasswordGate v-if="!unlocked" :expected-password="expectedPassword" @unlocked="unlockSite" />

  <div v-else class="app-shell">
    <PageNav v-model="activePage" />

    <main class="main-content">
      <LandingPage v-show="activePage === 'landing'" @go-uv="openUvPage" @go-page="openPage" />
      <HomePage v-show="activePage === 'uv'" :is-active="activePage === 'uv'" />
      <AwarenessPage v-show="activePage === 'awareness'" />
      <RiskCalculatorPage v-show="activePage === 'risk'" />
    </main>

    <footer class="site-footer">
      <div class="footer-main">
        <div class="footer-socials" aria-label="Social links">
          <span class="social-chip">f</span>
          <span class="social-chip">ig</span>
          <span class="social-chip">x</span>
          <span class="social-chip">yt</span>
        </div>
        <nav class="footer-links" aria-label="Footer links">
          <a href="#" @click.prevent>Home</a>
          <a href="#" @click.prevent>UV Index</a>
          <a href="#" @click.prevent>Awareness</a>
          <a href="#" @click.prevent>Risk</a>
          <a href="#" @click.prevent>Contact</a>
        </nav>
      </div>
      <p class="footer-copy">Copyright ©2026 Sun Safe Camp</p>
    </footer>
  </div>
</template>
