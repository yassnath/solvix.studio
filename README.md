# solvix.studio

Portfolio website untuk Solvix Studio dengan gaya futuristik, theme toggle, bilingual (ID/EN), dan chatbot Cerebras.

## Struktur

```
assets/
  css/
    styles.css
  js/
    script.js
  img/
    logo.png
    logo2.png
index.html
server.js
```

## Menjalankan (lokal)

### Opsi A: Static + API (disarankan)
1. Jalankan server API:
   ```powershell
   $env:CEREBRAS_API_KEY="isi_api_key"
   $env:PORT="3002"
   node server.js
   ```
2. Buka `index.html` melalui Live Server / static server (mis. `http://127.0.0.1:3000`).
3. Pastikan `data-chat-endpoint` di `index.html` mengarah ke:
   ```
   http://127.0.0.1:3002/api/cerebras
   ```

### Opsi B: Single server
1. Jalankan server:
   ```powershell
   $env:CEREBRAS_API_KEY="isi_api_key"
   $env:PORT="3002"
   node server.js
   ```
2. Buka `http://127.0.0.1:3002/`.
3. (Opsional) Ubah `data-chat-endpoint` di `index.html` menjadi `/api/cerebras`.

## Environment Variables

- `CEREBRAS_API_KEY` (wajib)
- `CEREBRAS_MODEL` (opsional, default: `llama3.1-8b`)
- `CEREBRAS_API_URL` (opsional)
- `PORT` (opsional, default: `3000`)

## Catatan

- Jangan commit API key ke GitHub. Simpan di environment variable.
