<script setup>
const props = defineProps({
  item: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    default: 0
  }
})

const emit = defineEmits(['share'])
</script>

<template>
  <article class="card myth-card">
    <span class="myth-badge">Myth {{ props.index + 1 }}</span>
    <h3>{{ props.item.title }}</h3>
    <p class="myth-text">{{ props.item.explanation }}</p>
    <button type="button" class="icon-btn" aria-label="Share myth card" @click="emit('share', props.item)">
      ⤴ Share
    </button>
  </article>
</template>
