# 🔧 Environment Variables Setup

## 📝 .env Konfiguracija

Aplikacija koristi `.env` fajl za konfiguraciju API endpoint-a.

---

## 🚀 Postavljanje

### 1. Kreiraj .env fajl

U root folderu projekta (gdje je `package.json`):

```bash
# Windows (PowerShell)
Copy-Item .env.example .env

# ili ručno kreiraj fajl .env
```

### 2. Konfiguriši API URL

**.env fajl:**
```env
REACT_APP_API_BASE_URL=https://api.parentivo.online
REACT_APP_API_TIMEOUT=30000
```

---

## 🌍 Environments

### Production (Trenutno):
```env
REACT_APP_API_BASE_URL=https://api.parentivo.online
```

### Development (Lokalni backend):
```env
REACT_APP_API_BASE_URL=http://localhost:3333
```

### Staging (ako postoji):
```env
REACT_APP_API_BASE_URL=https://staging-api.parentivo.online
```

---

## ⚙️ Kako Radi

### config.ts:
```typescript
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.parentivo.online';
```

### Korištenje:
```typescript
import { API_BASE_URL } from './config';

axios.create({
  baseURL: API_BASE_URL,  // https://api.parentivo.online
});
```

---

## 🔐 Sigurnost

- ✅ `.env` je u `.gitignore` - **NE commit-uje se na GitHub**
- ✅ `.env.example` je template - **ovo se commit-uje**
- ✅ Svaki developer kreira svoj `.env` lokalno

---

## 🚨 Važno!

### Restart Aplikacije Nakon Izmjene:

React učitava environment variables **SAMO PRI STARTU**!

```bash
# STOP server (Ctrl+C)
# IZMIJENI .env fajl
# START opet
npm start
```

---

## 📋 Provjera

Otvori Console (F12) i upiši:

```javascript
console.log(process.env.REACT_APP_API_BASE_URL);
```

Trebalo bi ispisati: `https://api.parentivo.online`

---

## 🎯 Primjer .env Fajla

```env
# API Configuration
REACT_APP_API_BASE_URL=https://api.parentivo.online
REACT_APP_API_TIMEOUT=30000

# Napomena: Sve React env varijable MORAJU početi sa REACT_APP_
```

---

## ❌ Česte Greške

### 1. Env variable nije učitana
**Uzrok:** Server nije restartovan nakon izmjene .env  
**Rješenje:** Ctrl+C pa `npm start` ponovo

### 2. Variable je undefined
**Uzrok:** Ime ne počinje sa `REACT_APP_`  
**Rješenje:** Uvijek koristi prefix `REACT_APP_`

### 3. Promjene se ne vide
**Uzrok:** Browser cache  
**Rješenje:** Ctrl+Shift+R (hard refresh)

---

## 🔄 Deployment

### Build za Production:

```bash
npm run build
```

Build proces **automatski uzima** vrijednosti iz `.env` fajla!

---

Gotovo! 🎉
