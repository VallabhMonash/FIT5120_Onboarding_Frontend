<script setup>
import { ref } from 'vue'
import PageNav from './components/PageNav.vue'
import AwarenessPage from './pages/AwarenessPage.vue'
import ContactPage from './pages/ContactPage.vue'
import HomePage from './pages/HomePage.vue'
import LandingPage from './pages/LandingPage.vue'
import RiskCalculatorPage from './pages/RiskCalculatorPage.vue'

const activePage = ref('landing')

function openUvPage() {
  activePage.value = 'uv'
}

function openPage(pageId) {
  activePage.value = pageId
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <div class="app-shell">
    <PageNav v-model="activePage" />

    <main class="main-content">
      <LandingPage v-show="activePage === 'landing'" @go-uv="openUvPage" @go-page="openPage" />
      <HomePage v-show="activePage === 'uv'" :is-active="activePage === 'uv'" />
      <AwarenessPage v-show="activePage === 'awareness'" />
      <RiskCalculatorPage v-show="activePage === 'risk'" />
      <ContactPage v-show="activePage === 'contact'" />
    </main>

    <footer class="site-footer">
      <div class="footer-main">
        <div class="footer-socials" aria-label="Social links">
          <span class="social-chip" role="img" aria-label="Facebook">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M13.5 8.5V6.9c0-.8.5-1.2 1.3-1.2h1.5V3h-2.1C11.6 3 10 4.6 10 7v1.5H8v3h2V21h3.5v-9.5h2.4l.4-3z" />
            </svg>
          </span>
          <span class="social-chip" role="img" aria-label="Instagram">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M7 2h10a5 5 0 0 1 5 5v10a5 5 0 0 1-5 5H7a5 5 0 0 1-5-5V7a5 5 0 0 1 5-5m0 2a3 3 0 0 0-3 3v10a3 3 0 0 0 3 3h10a3 3 0 0 0 3-3V7a3 3 0 0 0-3-3zm11.25 1.5a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5M12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10m0 2a3 3 0 1 0 0 6 3 3 0 0 0 0-6" />
            </svg>
          </span>
          <span class="social-chip" role="img" aria-label="X">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M18.9 3H22l-6.8 7.8L23 21h-6.1l-4.8-6.3L6.7 21H3.6l7.3-8.4L1 3h6.2l4.3 5.8zM17.8 19h1.7L6.3 4.9H4.5z" />
            </svg>
          </span>
          <span class="social-chip" role="img" aria-label="YouTube">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M23 12s0-3.3-.4-4.9a2.6 2.6 0 0 0-1.8-1.8C19.1 5 12 5 12 5s-7.1 0-8.8.3a2.6 2.6 0 0 0-1.8 1.8C1 8.7 1 12 1 12s0 3.3.4 4.9a2.6 2.6 0 0 0 1.8 1.8C4.9 19 12 19 12 19s7.1 0 8.8-.3a2.6 2.6 0 0 0 1.8-1.8C23 15.3 23 12 23 12M10 15.5v-7l6 3.5z" />
            </svg>
          </span>
        </div>
        <nav class="footer-links" aria-label="Footer links">
          <a href="#" @click.prevent="openPage('landing')">Home</a>
          <a href="#" @click.prevent="openPage('uv')">UV Index</a>
          <a href="#" @click.prevent="openPage('awareness')">Awareness</a>
          <a href="#" @click.prevent="openPage('risk')">Risk</a>
          <a href="#" @click.prevent="openPage('contact')">Contact</a>
        </nav>
      </div>
      <p class="footer-copy">Copyright ©2026 Sun Safe Camp</p>
    </footer>
  </div>
</template>
