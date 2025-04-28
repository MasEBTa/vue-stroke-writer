<template>
  <div>
    <!-- :width="size" dan :height="size": Ini adalah binding untuk atribut width dan height SVG. size diambil dari props dan akan menentukan ukuran gambar SVG. Ini bisa berupa string atau angka (misalnya "256" atau 256). -->
    <!-- viewBox="0 0 24 24": Ini mendefinisikan ukuran dan koordinat untuk "viewport" dari SVG. Dengan kata lain, ini mengatur bagaimana SVG ditampilkan dalam kotak tersebut. Misalnya, 24 24 adalah lebar dan tinggi dari area kerja (kanvas) SVG. -->
    <svg
      :width="size"
      :height="size"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <!-- :key="index": Di Vue, v-for membutuhkan key untuk menjaga identitas dan performa render, terutama ketika ada perubahan data. -->
      <!-- :d="stroke": Menghubungkan instruksi d dari setiap path yang akan menggambar bentuknya (misalnya "M10 10 L20 20", ini adalah format path SVG). -->
      <!-- :style="{ animationDelay: ${index * delayBetweenStrokes}s }": Ini memberikan delay dinamis pada animasi setiap path berdasarkan indeksnya. Misalnya, path pertama akan mulai lebih cepat (delay 0 detik), path kedua akan memiliki delay 1.5 detik, dan seterusnya. -->
      <!-- :stroke="strokeColor": Menggunakan warna garis yang diset dari props strokeColor. -->
      <!-- stroke-width="2": Mengatur ketebalan garis stroke menjadi 2. -->
      <!-- stroke-linecap="round" dan stroke-linejoin="round": Mengatur bentuk ujung dan sambungan garis stroke menjadi bulat. -->
      <!-- fill="none": Mengatur agar area di dalam path tidak diisi dengan warna (hanya garis yang digambar) -->
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
  /* stroke-dasharray: 300 dan stroke-dashoffset: 300: Ini adalah teknik untuk menciptakan efek garis terputus-putus (dashed). Nilai 300 mengindikasikan panjang total stroke dan offset-nya. */
  stroke-dasharray: 300;
  stroke-dashoffset: 300;
  /* animation: draw 1.5s linear forwards;: Ini mengaplikasikan animasi yang disebut draw selama 1.5 detik, menggunakan timing function linear (animasi berjalan dengan kecepatan yang sama sepanjang waktu), dan properti forwards memastikan bahwa hasil animasi tetap terlihat setelah animasi selesai (stroke penuh terlihat). */
  animation: draw 1.5s linear forwards;
}

/* @keyframes draw: Ini adalah definisi animasi CSS. */
@keyframes draw {
  /* to { stroke-dashoffset: 0; }: Ketika animasi selesai, stroke-dashoffset berubah menjadi 0, yang berarti garis akan "digambar" secara penuh dari posisi awal (terputus-putus) ke garis penuh tanpa putus */
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
