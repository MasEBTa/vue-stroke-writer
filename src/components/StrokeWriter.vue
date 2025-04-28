<template>
  <div>
    <svg
      ref="svgRef"
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
        :style="getStrokeStyle(index)"
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
import { ref, onMounted } from "vue";

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
    default: 1.5,
  },
  animationDuration: {
    type: Number,
    default: 1.5,
  },
});

const svgRef = ref(null); // 🛠️ Ini buat scope querySelectorAll hanya di SVG ini

const keyframesInjected = ref(false);
const isAnimationStarted = ref(false);

function injectKeyframesOnce() {
  if (keyframesInjected.value) return;
  const style = document.createElement("style");
  style.innerHTML = `
    @keyframes draw {
      to {
        stroke-dashoffset: 0;
      }
    }
  `;
  document.head.appendChild(style);
  keyframesInjected.value = true;
}

function getStrokeStyle(index) {
  const delay = props.delayBetweenStrokes * index;
  return {
    strokeDasharray: 300,
    strokeDashoffset: 300,
    animation: "none", // initially no animation
  };
}

function applyAnimation() {
  if (!svgRef.value) return;
  const paths = svgRef.value.querySelectorAll(".stroke-path"); // cuma dalam SVG ini
  paths.forEach((path, index) => {
    path.style.animation = `draw ${props.animationDuration}s linear ${
      index * props.delayBetweenStrokes
    }s forwards`;
  });
}

function resetAnimation() {
  if (!svgRef.value) return;
  const paths = svgRef.value.querySelectorAll(".stroke-path");
  paths.forEach((path) => {
    path.style.animation = "none";
    path.style.strokeDashoffset = 300;
  });
}

function restartAnimation() {
  resetAnimation(); // Reset animasi terlebih dahulu
  setTimeout(() => {
    applyAnimation(); // Terapkan animasi setelah reset selesai
  }, 0); // 0 ms delay untuk menjalankan applyAnimation di next event loop
}

onMounted(() => {
  injectKeyframesOnce();
  applyAnimation(); // Optional: start animation when the component is mounted
});

defineExpose({
  restartAnimation,
  resetAnimation,
});
</script>

<style scoped>
.stroke-path {
  stroke-dasharray: 300;
  stroke-dashoffset: 300;
}
</style>
