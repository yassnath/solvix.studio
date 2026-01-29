# solvix.studio

Portfolio website untuk Solvix Studio dengan tema gelap/terang, bilingual (ID/EN), dan chatbot Cerebras. Dibangun ulang dengan React + Vite.

## Struktur

```
public/
  assets/
    img/
      logo.png
      logo2.png
api/
  cerebras.cjs
src/
  data/
    translations.js
  App.jsx
  main.jsx
  styles.css
index.html
```

## Menjalankan (lokal)

### UI (React)
1. Install dependencies:
   ```powershell
   npm install
   ```
2. Set environment untuk chatbot (PowerShell):
   ```powershell
   $env:CEREBRAS_API_KEY="isi_api_key"
   $env:CEREBRAS_MODEL="llama3.1-8b"
   ```
3. Jalankan dev server:
   ```powershell
   npm run dev
   ```
4. Buka URL dari Vite (default `http://127.0.0.1:5173`).

Chatbot otomatis memakai proxy lokal `/api/cerebras` dari Vite dev server.

### API Chatbot (Cerebras)
API menggunakan serverless function `api/cerebras.cjs` untuk production.

Set environment variable di platform hosting (contoh Vercel):
```
CEREBRAS_API_KEY=isi_api_key
CEREBRAS_MODEL=llama3.1-8b
```

Secara default app memanggil endpoint relatif:
```
/api/cerebras
```

Jika ingin mengarah ke endpoint lain, set env Vite:
```
VITE_CHAT_ENDPOINT=https://domain-kamu.com/api/cerebras
```

## Environment Variables

- `CEREBRAS_API_KEY` (wajib)
- `CEREBRAS_MODEL` (opsional, default: `llama3.1-8b`)
- `CEREBRAS_API_URL` (opsional)
 - `VITE_CHAT_ENDPOINT` (opsional, untuk UI React)

## Catatan

- Jangan commit API key ke GitHub. Simpan di environment variable.
