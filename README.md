# solvix.studio

Portfolio website untuk Solvix Studio dengan tema gelap/terang, bilingual (ID/EN), dan chatbot Cerebras. Dibangun ulang dengan React + Vite.

## Struktur

```
public/
  assets/
    img/
      logo.png
      logo2.png
src/
  data/
    translations.js
  App.jsx
  main.jsx
  styles.css
index.html
server.js
```

## Menjalankan (lokal)

### UI (React)
1. Install dependencies:
   ```powershell
   npm install
   ```
2. Jalankan dev server:
   ```powershell
   npm run dev
   ```
3. Buka URL dari Vite (default `http://127.0.0.1:5173`).

### API Chatbot (Cerebras)
Jalankan server API terpisah:
```powershell
$env:CEREBRAS_API_KEY="isi_api_key"
$env:PORT="3002"
node server.js
```

Secara default app mengakses:
```
http://127.0.0.1:3002/api/cerebras
```

Opsional: ubah endpoint via env Vite:
```
VITE_CHAT_ENDPOINT=http://127.0.0.1:3002/api/cerebras
```

## Environment Variables

- `CEREBRAS_API_KEY` (wajib)
- `CEREBRAS_MODEL` (opsional, default: `llama3.1-8b`)
- `CEREBRAS_API_URL` (opsional)
- `PORT` (opsional, default: `3000`)
 - `VITE_CHAT_ENDPOINT` (opsional, untuk UI React)

## Catatan

- Jangan commit API key ke GitHub. Simpan di environment variable.
