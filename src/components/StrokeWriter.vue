<template>
  <div>
    <svg
      :width="size"
      :height="size"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g :key="animationKey">
        <!-- PERUBAHANNYA DI SINI -->
        <path
          v-for="(stroke, index) in strokes"
          :key="index"
          :d="stroke"
          class="stroke-path"
          :stroke="strokeColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          :style="{
            animationDelay: `${index * delayBetweenStrokes}s`,
            animationDuration: `${animationDuration}s`,
          }"
        />
      </g>
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
    default: 0.5,
  },
  animationDuration: {
    type: Number,
    default: 1.5,
  },
});

// ini kunci untuk force reload animasi
const animationKey = ref(0);

function restartAnimation() {
  animationKey.value++; // cukup increment ini
}

defineExpose({
  restartAnimation,
});
</script>

<style scoped>
@keyframes draw {
  0% {
    stroke-dashoffset: 300;
  }
  100% {
    stroke-dashoffset: 0;
  }
}

.stroke-path {
  stroke-dasharray: 300;
  stroke-dashoffset: 300;
  animation-name: draw;
  animation-timing-function: linear;
  animation-fill-mode: forwards;
}
</style>
