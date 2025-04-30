<template>
  <div>
    <svg
      ref="svgRef"
      :width="size"
      :height="size"
      :viewBox="`0 0 ${viewBox} ${viewBox}`"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g :key="animationKey">
        <!-- PERUBAHANNYA DI SINI -->
        <path
          v-for="(stroke, index) in strokesData"
          :key="index"
          :d="stroke"
          class="stroke-path"
          :stroke="strokeColor"
          :stroke-width="strokeWidth"
          stroke-linecap="round"
          stroke-linejoin="round"
          fill="none"
          :style="[
            {
              animationDelay: `${index * delayBetweenStrokes}s`,
              animationDuration: `${animationDuration}s`,
            },
            'color: red',
          ]"
        />
      </g>
    </svg>
  </div>
  <!-- 
    stroke-linejoin="round/bevel/miter/miter-clip"
    stroke-linecap="round/square/butt" 
    -->
</template>

<script setup>
import { ref, computed, nextTick } from "vue";
const svgRef = ref(null);

const props = defineProps({
  strokesData: {
    type: Array,
    required: true,
  },
  viewBox: {
    type: [String, Number],
    default: 24,
  },
  size: {
    type: [String, Number],
    default: 256,
  },
  strokeWidth: {
    type: [String, Number],
    default: 2,
  },
  lineJoin: {
    type: String,
    default: "round",
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
    default: 2,
  },
  autoStart: {
    type: Boolean,
    default: true,
  },
});

// Validasi lineJoin
const validLineJoins = ["round", "bevel", "miter", "miter-clip"];
const safeLineJoin = computed(() => {
  return validLineJoins.includes(props.lineJoin) ? props.lineJoin : "round";
});

function resetAllAnimations() {
  if (!svgRef.value) return;
  const paths = svgRef.value.querySelectorAll(".stroke-path");
  paths.forEach((path) => {
    path.style.animation = "none"; // Hapus animasinya
    path.offsetHeight; // Force reflow browser (wajib ini)
  });
}

// ini kunci untuk force reload animasi
const animationKey = ref(0);

function restartAnimation() {
  animationKey.value++; // cukup increment ini
}
if (!props.autoStart) {
  // kalau autoStart true, langsung restart animasi setelah render
  nextTick(() => {
    resetAllAnimations();
  });
}
defineExpose({
  resetAllAnimations,
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
