# DIKO Guru

Portal layanan kepegawaian untuk guru. Versi ringan yang terpisah dari aplikasi admin DIKO, namun nantinya akan memakai database yang sama.

## Cara Mencoba

1. Buka file `index.html` langsung di browser (double-click atau drag ke Chrome/Firefox).
2. Login dengan NIP apa saja (contoh sudah terisi) dan password apa saja.
3. Coba fitur:
   - **Lapor Disiplin** — isi form dan kirim.
   - **Status Laporan** — lihat daftar laporan (data tersimpan sementara di browser).
   - **Profil** — lihat data dummy.

## Catatan

- Saat ini berjalan dalam **mode demo** (data tidak dikirim ke server).
- Setelah tampilan dan alur sudah sesuai, backend akan dihubungkan ke Google Apps Script DIKO yang sama.
- Tidak memerlukan internet atau instalasi apa pun untuk mencoba.

## Struktur File

```
diko-guru/
├── index.html
├── style.css
├── app.js
├── config.js
└── README.md
```
