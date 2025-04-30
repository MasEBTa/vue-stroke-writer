<!-- ./HiraganaStrokeViewer.vue -->
<template>
  <div>
    <!-- 
      * Komponen ini me-render <svg> berukuran size × size piksel.
      * viewBox="0 0 viewBox viewBox": menyamakan skala stroke referensi dengan canvas.
      * - Misal, kalau viewBox=24, maka isi SVG di-skala dari (0,0) sampai (24,24).
      * Di dalam <g>, kita menggambar beberapa <path>:
      * - v-for="stroke in strokes": looping semua stroke.
      * - :d="stroke.path": path SVG dari masing-masing stroke.
      * - :stroke="stroke.color": warna stroke.
      * - :stroke-width="strokeWidth": ketebalan garis (default 2).
      * - :stroke-linecap="lineCap": ujung garis (bulat atau datar).
      * - :stroke-linejoin="safeLineJoin": sambungan antar garis (cek validitas di bawah).
      * - fill="none": tidak mewarnai area dalam path. -->
    <svg
      :width="size"
      :height="size"
      :viewBox="`0 0 ${viewBox} ${viewBox}`"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g>
        <path
          v-for="(stroke, index) in strokes"
          :key="index"
          :d="stroke.path"
          :stroke="stroke.color"
          :stroke-width="strokeWidth"
          :stroke-linecap="lineCap"
          :stroke-linejoin="safeLineJoin"
          fill="none"
        />
      </g>
    </svg>
  </div>
</template>

<script setup>
import { computed } from "vue";

/**
 * Komponen menerima properti dari luar:
 * - strokes: array stroke seperti [{ path, color }] → WAJIB.
 * - viewBox: ukuran kotak referensi SVG.
 * - size: ukuran tampilan SVG.
 * - strokeWidth, lineCap, lineJoin: gaya garis.
 */
const props = defineProps({
  strokes: { type: Array, required: true },
  viewBox: { type: [String, Number], default: 24 },
  size: { type: [String, Number], default: 256 },
  strokeWidth: { type: [String, Number], default: 2 },
  lineJoin: { type: String, default: "round" },
  lineCap: { type: String, default: "round" },
});

/** Validasi lineJoin
 * Tujuannya: menghindari error kalau ada lineJoin tidak valid.
 * Jika properti lineJoin bukan salah satu yang sah, maka default ke "round".
 */
const validLineJoins = ["round", "bevel", "miter", "miter-clip"];
const safeLineJoin = computed(() =>
  validLineJoins.includes(props.lineJoin) ? props.lineJoin : "round"
);
</script>
