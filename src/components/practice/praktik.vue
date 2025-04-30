<!-- 
 Penjelasan:
- <div> digunakan sebagai wadah utama dengan ukuran strokes px.
- Komponen <HiraganaStrokeViewer> menampilkan stroke referensi dari huruf hiragana dalam bentuk SVG.
- :strokes="strokes" artinya kita mengirim array stroke ke komponen ini.
- :size="size" dan :viewBox="viewBox" adalah properti tambahan untuk ukuran dan skala tampilan SVG.
- Komponen <StrokeCanvas> adalah kanvas interaktif tempat user menggambar.
- ref="canvas" memungkinkan kita mengakses metode pada canvas (seperti clearCanvas()).
- :onFinish="handleFinish" menghubungkan event setelah user selesai menggambar, lalu diproses oleh handleFinish.
-->
<template>
  <div style="position: relative; width: size; height: size">
    <HiraganaStrokeViewer :strokes="strokes" :size="size" :viewBox="viewBox" />
    <StrokeCanvas ref="canvas" :size="size" :onFinish="handleFinish" />
  </div>
</template>

<script setup>
/**
 * Mengimpor ref dari Vue Composition API untuk reaktivitas.
 * Mengimpor dua komponen:
 * - HiraganaStrokeViewer: komponen tampilan stroke SVG.
 * - StrokeCanvas: komponen tempat user menggambar.
 */
import { ref } from "vue";
import HiraganaStrokeViewer from "./HiraganaStrokeViewer.vue";
import StrokeCanvas from "./StrokeCanvas.vue";

/** Data dan Variabel
 * strokes adalah array dari path SVG dengan warna default abu-abu (#ccc).
 * Digunakan sebagai data referensi huruf yang harus ditiru user. */
const strokes = ref([
  { path: "M7.53125 6 C9 6 13 5.5 15.5352 5", color: "#ccc" }, // contoh
  { path: "M11.5306 3 C10.5 7 9.5 10.5 11.5306 19", color: "#ccc" },
  {
    path: "M15.4862 9 C15.5559 9.45126 15.5119 10.0367 15.3595 10.7008, M15.3595 10.7008 C14.647 13.8037 11.5647 18.6233 6.63251 19.4919 C6.63251 19.4919 5.28441 19.7802 4.54266 19.0227 C3.28198 17.7351 3.41266 14.3283 14.0208 11.0015 C14.456 10.865 14.9075 10.764 15.3595 10.7008 M15.3595 10.7008 C19.6125 10.1058 23.899 12.8624 14.8758 21",
    color: "#ccc",
  },
]);

const currentIndex = ref(0);
const size = 256;
const viewBox = 24;

const canvas = ref(null);

// Fungsi menghitung jarak antara dua titik
function distance(a, b) {
  return Math.sqrt((a.x - b.x) ** 2 + (a.y - b.y) ** 2);
}

/** Konversi path referensi menjadi array titik
 * Fungsi ini mengambil string d dari path SVG dan mengubahnya menjadi 100 titik koordinat.
 * Tujuannya adalah untuk membandingkan stroke dari user dengan stroke referensi.
 * Koordinat titik disesuaikan agar pas dengan ukuran canvas size.
 * */
function getReferencePoints(d, numPoints = 100) {
  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", d);
  path.setAttribute("viewBox", `0 0 ${viewBox} ${viewBox}`);

  const length = path.getTotalLength();
  const points = [];

  for (let i = 0; i < numPoints; i++) {
    const pt = path.getPointAtLength((i / numPoints) * length);
    points.push({
      x: (pt.x / viewBox) * size,
      y: (pt.y / viewBox) * size,
    });
  }

  return points;
}

/** Validasi jalur gambar user vs referensi
 * Bandingkan userPath (hasil coretan user) dengan refPoints (stroke referensi).
 * Menghitung rata-rata jarak per titik.
 * Jika jaraknya kecil (<80), dianggap "mirip".
 * */
function isSimilarPath(userPath, refPath) {
  const refPoints = getReferencePoints(refPath);
  const minLen = Math.min(userPath.length, refPoints.length);

  let totalDist = 0;
  for (let i = 0; i < minLen; i++) {
    totalDist += distance(userPath[i], refPoints[i]);
  }

  const avgDist = totalDist / minLen;
  console.log("Rata-rata jarak:", avgDist);
  return avgDist < 80; // threshold, bisa disesuaikan
}

/** Fungsi: handleFinish (Saat Gambar Selesai)
 * @param userPath - path user
 * Ambil path referensi stroke saat ini.
 * Jika path user dianggap mirip:
 * - Ubah warna stroke jadi hitam ("#000").
 * - Lanjut ke stroke berikutnya (currentIndex++).
 * - Jika sudah selesai semua, hanya bersihkan canvas.
 * Jika tidak mirip, hanya bersihkan kanvas untuk dicoba ulang.
 */
function handleFinish(userPath) {
  const refPath = strokes.value[currentIndex.value].path;
  if (isSimilarPath(userPath, refPath)) {
    // Ganti warna stroke menjadi hitam ketika benar
    strokes.value[currentIndex.value].color = "#000";
    currentIndex.value++; // Pindah ke stroke berikutnya

    // Periksa apakah sudah selesai
    if (currentIndex.value >= strokes.value.length) {
      // alert("Selesai!");
      canvas.value.clearCanvas(); // Bersihkan kanvas jika tidak mirip
    } else {
      // Perbarui stroke referensi dan reset warna stroke berikutnya
      strokes.value[currentIndex.value].color = "#ccc"; // Reset warna untuk stroke berikutnya
      canvas.value.clearCanvas(); // Bersihkan kanvas untuk stroke berikutnya
    }
  } else {
    // alert("Belum mirip, coba lagi!");
    canvas.value.clearCanvas(); // Bersihkan kanvas jika tidak mirip
  }
}
</script>
