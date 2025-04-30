<template>
  <div :style="`position: relative; width: ${size}px; height: ${size}px`">
    <HiraganaStrokeViewer
      :strokes="strokes"
      :size="size"
      :viewBox="viewBox"
      :strokeWidth="strokeWidth"
      :lineCap="lineCap"
      :lineJoin="lineJoin"
    />
    <!-- Hanya tampilkan StrokeCanvas jika belum selesai -->
    <StrokeCanvas
      v-if="!isFinished"
      ref="canvas"
      :size="size"
      :onFinish="handleFinish"
      :strokeWidth="canvasStrokeWidth"
      :lineCap="canvasLineCap"
      :lineJoin="canvasLineJoin"
      :strokeColor="canvasColor"
    />
  </div>
</template>

<script setup>
import { ref } from "vue";
import HiraganaStrokeViewer from "./HiraganaStrokeViewer.vue";
import StrokeCanvas from "./StrokeCanvas.vue";

const emit = defineEmits(["finished"]);

const props = defineProps({
  strokesData: Array,
  size: { type: Number, default: 256 },
  viewBox: { type: Number, default: 24 },
  trial: { type: Number, default: 3 },

  // Warna referensi
  defaultColor: { type: String, default: "#ccc" },
  successColor: { type: String, default: "#000" },
  finishColor: { type: String, default: "green" },
  wrongColor: { type: String, default: "red" },

  // Gaya referensi SVG
  strokeWidth: { type: [Number, String], default: 2 },
  lineCap: { type: String, default: "round" },
  lineJoin: { type: String, default: "round" },

  // Gaya kanvas user
  canvasStrokeWidth: { type: Number, default: 6 },
  canvasLineCap: { type: String, default: "round" },
  canvasLineJoin: { type: String, default: "round" },
  canvasColor: { type: String, default: "black" },
});

const isFinished = ref(false);
const currentIndex = ref(0);
const canvas = ref(null);
const attempts = ref(0); // Menyimpan jumlah percobaan untuk stroke saat ini
const wrongStrokes = ref([]); // Menyimpan indeks stroke yang salah

// Inisialisasi stroke awal
const strokes = ref(
  props.strokesData.map((path) => ({
    path,
    color: props.defaultColor,
  }))
);

function distance(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

function getReferencePoints(d, numPoints = 100) {
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", d);
  path.setAttribute("viewBox", `0 0 ${props.viewBox} ${props.viewBox}`);
  const length = path.getTotalLength();
  const points = [];

  for (let i = 0; i < numPoints; i++) {
    const pt = path.getPointAtLength((i / numPoints) * length);
    points.push({
      x: (pt.x / props.viewBox) * props.size,
      y: (pt.y / props.viewBox) * props.size,
    });
  }

  return points;
}

function isSimilarPath(userPath, refPath) {
  const refPoints = getReferencePoints(refPath);
  const minLen = Math.min(userPath.length, refPoints.length);
  let totalDist = 0;

  for (let i = 0; i < minLen; i++) {
    totalDist += distance(userPath[i], refPoints[i]);
  }

  const avgDist = totalDist / minLen;
  return !(avgDist > 50);
}

function handleFinish(userPath) {
  const refPath = strokes.value[currentIndex.value].path;

  if (isSimilarPath(userPath, refPath)) {
    // Jika benar
    strokes.value[currentIndex.value].color = props.successColor;
    nextStroke();
  } else {
    attempts.value++;

    if (attempts.value >= props.trial) {
      // Jika salah lebih dari x kali, anggap benar tapi simpan sebagai salah
      strokes.value[currentIndex.value].color = props.wrongColor;
      wrongStrokes.value.push(currentIndex.value); // Simpan indeks stroke yang salah
      nextStroke();
    } else {
      // Jika belum x kali, ulangi stroke ini
      canvas.value.clearCanvas();
    }
  }
}

function nextStroke() {
  currentIndex.value++;
  attempts.value = 0; // Reset percobaan
  canvas.value.clearCanvas();

  if (currentIndex.value >= strokes.value.length) {
    setTimeout(() => {
      isFinished.value = true;
      // Pastikan hanya stroke yang benar yang mendapatkan finishColor
      strokes.value = strokes.value.map((s, index) => ({
        ...s,
        color: wrongStrokes.value.includes(index) ? s.color : props.finishColor,
      }));
      emit("finished", {
        status: "success",
        message: `Latihan selesai! ${wrongStrokes.value.length} stroke(s) salah`,
      });
    }, 600); // beri waktu 600ms agar warna terlihat dulu
    return;
  } else {
    strokes.value[currentIndex.value].color = props.defaultColor;
  }
}
</script>
