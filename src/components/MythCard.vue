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
    <p>{{ props.item.explanation }}</p>
    <button type="button" class="secondary-btn" @click="emit('share', props.item)">Share</button>
  </article>
</template>
