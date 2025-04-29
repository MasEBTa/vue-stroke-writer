<template>
  <div>
    <h1>Latihan Menulis Hiragana: あ</h1>
    <StrokeCanvas :strokes="aStrokes" />
  </div>
</template>

<script setup>
import StrokeCanvas from "./StrokeCanvas.vue";
// Contoh path SVG sederhana untuk hiragana あ (bisa kamu ubah nanti)
const aStrokes = [
  "M10,10 C30,20 40,60 20,80",
  "M50,30 Q60,50 40,70",
  "M60,60 L80,80",
];
</script>
