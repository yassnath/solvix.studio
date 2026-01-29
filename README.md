# Solvix Studio — Digital Identity Portfolio

Solvix Studio adalah identitas kreatif untuk produk digital. Portofolio ini menonjolkan
karakter visual yang rapi, modern, dan berorientasi kebutuhan pengguna.

## Highlights

- Visual futuristik yang bersih dan konsisten
- Dark/Light theme toggle
- Bilingual (ID/EN) tanpa mengubah brand “Solvix Studio”
- Chatbot Cerebras terintegrasi
- Portfolio cards dengan preview visual

## Menjalankan secara lokal

1. Install dependencies:
   ```powershell
   npm install
   ```
2. Isi API key di `.env.local`:
   ```
   CEREBRAS_API_KEY=isi_api_key
   CEREBRAS_MODEL=llama3.1-8b
   ```
3. Jalankan dev server:
   ```powershell
   npm run dev
   ```

## Catatan penting

- Jangan commit API key ke GitHub.
- Untuk deployment, atur `CEREBRAS_API_KEY` di environment hosting.
