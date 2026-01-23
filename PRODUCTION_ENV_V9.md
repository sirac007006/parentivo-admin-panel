# 🚀 VERZIJA 9.0 - PRODUCTION READY!

## ✅ ŠTA SAM URADIO:

Prebacio sam **SVI API pozivi** na **production URL** i **izvukao u .env fajl**!

---

## 🎯 PROMJENE:

### 1. Kreiran .env fajl:
```env
REACT_APP_API_BASE_URL=https://api.parentivo.online
REACT_APP_API_TIMEOUT=30000
```

### 2. Ažuriran config.ts:
```typescript
// PRIJE:
export const API_BASE_URL = 'http://157.90.237.216:3333';  ❌

// SADA:
export const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.parentivo.online';  ✅
```

### 3. Dodato u .gitignore:
```
.env
.env.local
.env.development.local
.env.test.local
.env.production.local
```

### 4. Kreiran .env.example:
Template fajl koji se commit-uje na GitHub

---

## 📦 INSTALACIJA:

```powershell
# 1. STOP server
Ctrl+C

# 2. Raspakovati
cd C:\Users\Caretina\Desktop
tar -xzf parentivo-admin-v9.0-PRODUCTION-ENV.tar.gz
cd parentivo-admin

# 3. .env fajl je VEĆ KREIRAN!
# Možeš ga vidjeti: .env

# 4. Clean install
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
npm install

# 5. Start
npm start
```

---

## 🌍 API URL:

### Production (Trenutno):
```
https://api.parentivo.online
```

Sve API pozive sada idu na:
- ✅ `https://api.parentivo.online/auth/admin/login`
- ✅ `https://api.parentivo.online/users`
- ✅ `https://api.parentivo.online/slots/my`
- ✅ `https://api.parentivo.online/meetings/admin`
- itd...

---

## 🔧 KAKO PROMIJENITI API URL:

### 1. Otvori `.env` fajl u root folderu

### 2. Promijeni URL:

**Za Development (lokalni backend):**
```env
REACT_APP_API_BASE_URL=http://localhost:3333
```

**Za Staging:**
```env
REACT_APP_API_BASE_URL=https://staging-api.parentivo.online
```

**Za Production:**
```env
REACT_APP_API_BASE_URL=https://api.parentivo.online
```

### 3. RESTART aplikacije:
```bash
# STOP (Ctrl+C)
npm start
```

---

## 📋 PROVJERA:

Otvori Console (F12) i upiši:

```javascript
console.log(process.env.REACT_APP_API_BASE_URL);
```

Trebalo bi ispisati: `https://api.parentivo.online`

---

## 🎯 FAJLOVI:

```
parentivo-admin/
├── .env                    ← Production API URL (NE commit-uje se)
├── .env.example            ← Template (commit-uje se)
├── .gitignore              ← .env je ignored
├── ENV_SETUP.md            ← Detaljna dokumentacija
└── src/
    └── config.ts           ← Čita iz process.env
```

---

## ✅ GOTOVO!

**SVE je spremno za production!**

- ✅ API URL: `https://api.parentivo.online`
- ✅ U .env fajlu (lako se mijenja)
- ✅ Nema hardcoded URL-ova u kodu
- ✅ .env je u .gitignore (sigurno)
- ✅ .env.example za nove developere

---

## 🚀 DEPLOYMENT:

Kada budeš deployal na server:

```bash
# 1. Build
npm run build

# 2. Build uzima .env automatski!
# 3. Deploy /build folder
```

---

**INSTALIRAJ v9.0 I TESTIRAJ! 🎉**

Sve API pozive sada idu na production URL!
