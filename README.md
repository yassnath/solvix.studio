# Solvix Studio — Digital Identity Portfolio

Portofolio Solvix Studio yang menonjolkan identitas digital modern dengan tata visual
yang rapi, futuristik, dan berorientasi pengalaman pengguna. Dibangun sebagai single‑page
portfolio dengan highlight karya, stack, perjalanan, dan kanal komunikasi.

## Ringkasan

- Visual futuristik konsisten dengan grid, glow, dan glassy surface.
- Tema gelap/terang yang bisa di‑toggle.
- Bilingual (ID/EN) tanpa mengubah brand “Solvix Studio”.
- Chatbot Cerebras terintegrasi untuk menjawab pertanyaan seputar konten website.
- Kartu portofolio dengan preview visual.

## Struktur Konten

- Hero dengan highlight value proposition dan statistik singkat.
- Profil, karya, stack, dan timeline perjalanan.
- Kontak berbasis media sosial.

## Teknologi

- React + Vite
- CSS custom (tanpa framework)
- Integrasi API Cerebras via endpoint server

## Konfigurasi Lingkungan

Variabel di `.env.local` digunakan untuk integrasi chatbot:

```
CEREBRAS_API_KEY=your_key
CEREBRAS_MODEL=llama3.1-8b
VITE_CHAT_ENDPOINT=/api/cerebras
VITE_CHAT_VERSION=AI
```

## Catatan

- Jangan commit API key ke repositori publik.
- Untuk deployment, set `CEREBRAS_API_KEY` melalui environment hosting.
