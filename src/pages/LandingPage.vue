<script setup>
import { ref } from 'vue'

const emit = defineEmits(['go-uv', 'go-page'])
const heroImageAvailable = ref(true)
const heroImagePath = '/hero-family2.jpg'
const blobMainPath = '/blob1.svg'
const blobAccentPath = '/blob2.svg'

function startNow() {
  emit('go-uv')
}

function goTo(page) {
  if (page === 'uv') {
    emit('go-uv')
    return
  }

  emit('go-page', page)
}

function onHeroImageError() {
  heroImageAvailable.value = false
}
</script>

<template>
  <section class="landing">
    <section class="landing-hero card">
      <img
        v-if="heroImageAvailable"
        :src="heroImagePath"
        alt=""
        class="hero-bg"
        @error="onHeroImageError"
      />
      <div class="hero-blob-stack" aria-hidden="true">
        <img :src="blobMainPath" alt="" class="hero-blob-main" />
        <img :src="blobAccentPath" alt="" class="hero-blob-accent" />
      </div>
      <div class="hero-copy">
        <h1>Sun safety starts with one small habit before every bright day.</h1>
        <p>
          Check local UV instantly, get skin-tone aware guidance, and build protective habits with
          simple, playful steps for everyday life.
        </p>
        <div class="hero-actions">
          <button type="button" class="primary-btn hero-cta" @click="startNow">Check UV Now</button>
        </div>
      </div>
    </section>

    <section class="facts-strip card">
      <header class="facts-head">
        <h2>Why Sun Safety Matters</h2>
        <p>Quick evidence-based reminders before you head outdoors.</p>
      </header>
      <div class="facts-grid">
        <article class="fact-card">
          <img src="/Sunburn-rafiki.svg" alt="Sunscreen fact illustration" class="fact-art" />
          <h3>UV exposure is cumulative</h3>
          <p class="fact-stat">Daily protection matters</p>
          <p>Short unprotected exposure can add up over time, even during routine activities.</p>
        </article>

        <article class="fact-card">
          <img src="/Sunburn-pana.svg" alt="Sunburn fact illustration" class="fact-art" />
          <h3>Clouds do not block all UV</h3>
          <p class="fact-stat">Risk can still be high</p>
          <p>You can still get UV damage on cooler or cloudy days when it does not feel hot.</p>
        </article>

        <article class="fact-card">
          <img src="/Sunburn-amico.svg" alt="Awareness fact illustration" class="fact-art" />
          <h3>Prevention changes outcomes</h3>
          <p class="fact-stat">Habits reduce long-term harm</p>
          <p>Sunscreen, shade, and protective clothing together improve long-term skin safety.</p>
        </article>
      </div>
    </section>

    <section class="duo-section duo-alt card">
      <img src="/winter-solstice-rafiki.svg" alt="Awareness illustration" class="duo-art" />
      <div class="duo-copy">
        <h2>Track UV risk in seconds</h2>
        <p>
          Get a quick UV snapshot for your location and make safer decisions before stepping out.
        </p>
        <button type="button" class="secondary-btn" @click="goTo('uv')">Open UV Index</button>
      </div>
    </section>

    <section class="duo-section card">
      <div class="duo-copy">
        <h2>Learn through visual awareness</h2>
        <p>Understand myths and trends with bite-sized cards and easy-to-read visuals.</p>
        <button type="button" class="secondary-btn" @click="goTo('awareness')">
          Open Awareness
        </button>
      </div>
      <img src="/sunscreen-amico.svg" alt="Sunscreen illustration" class="duo-art" />
    </section>

    <section class="duo-section duo-alt card">
      <div class="duo-copy">
        <h2>Personalised prevention guidance</h2>
        <p>
          Choose your skin tone and explore practical protection advice tailored to your UV
          sensitivity.
        </p>
        <button type="button" class="secondary-btn" @click="goTo('risk')">
          Open Risk Calculator
        </button>
      </div>
      <img src="/sunburn-bro.svg" alt="Sunburn prevention illustration" class="duo-art" />
    </section>
  </section>
</template>
