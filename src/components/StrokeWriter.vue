<template>
  <div>
    <svg
      :width="size"
      :height="size"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        v-for="(stroke, index) in strokes"
        :key="index"
        :d="stroke"
        class="stroke-path"
        :style="{ animationDelay: `${index * delayBetweenStrokes}s` }"
        :stroke="strokeColor"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        fill="none"
      />
    </svg>
  </div>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  strokes: {
    type: Array,
    required: true,
  },
  size: {
    type: [String, Number],
    default: 256,
  },
  strokeColor: {
    type: String,
    default: "#000000",
  },
  delayBetweenStrokes: {
    type: Number,
    default: 1.5, // detik
  },
});
</script>

<style scoped>
.stroke-path {
  stroke-dasharray: 300;
  stroke-dashoffset: 300;
  animation: draw 1.5s linear forwards;
}

@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}

/* .writer-container {
  display: flex;
  justify-content: center;
  align-items: center;
} */
</style>
