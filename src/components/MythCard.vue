<script setup>
const props = defineProps({
  item: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['share'])
</script>

<template>
  <article class="card myth-card">
    <h3>{{ props.item.title }}</h3>
    <p class="myth-text">{{ props.item.explanation }}</p>
    <button type="button" class="icon-btn" aria-label="Share myth card" @click="emit('share', props.item)">
      ⤴ Share
    </button>
  </article>
</template>
