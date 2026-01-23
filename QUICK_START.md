# 🚀 Parentivo Admin Panel - Brzi Start

## ✅ VERZIJA 2.1 - Fiksirane Dependencije!

**Sada koristi STABILNE i KOMPATIBILNE verzije!**

---

## 📦 Instalacija (GARANTOVANO radi)

### U PowerShell-u:

```powershell
# 1. Raspakovati
cd C:\Users\Caretina\Desktop
tar -xzf parentivo-admin-v2-final.tar.gz
cd parentivo-admin

# 2. OČISTITI stare fajlove (ako postoje)
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue

# 3. Instaliraj dependencije
npm install

# 4. Pokreni
npm start
```

✅ **Aplikacija: http://localhost:3000**

---

## ⚠️ Ako vidiš grešku:

### ERESOLVE conflict:

```powershell
npm install --legacy-peer-deps
```

### ajv modul ne postoji:

```powershell
npm install ajv@^8.12.0 --save
npm start
```

### Permission denied:

Pokreni PowerShell **kao Administrator**

---

## 🔧 Konfiguracija API

Edituj `src/config.ts`:

```typescript
export const API_BASE_URL = 'http://157.90.237.216:3333';
```

---

## 🧪 PRVO - Test Backend!

**OBAVEZNO prije login-a:**

### Metoda 1: test-backend.html

```powershell
# Otvori test-backend.html u Chrome/Firefox
start test-backend.html
```

Unesi kredencijale i vidi šta backend vraća!

### Metoda 2: Browser Console

```powershell
npm start
# Otvori http://localhost:3000
# F12 → Console
# Pokušaj login
# Vidi "Raw API response"
```

---

## 🔑 Backend Format

Backend **MORA** vratiti:

```json
{
  "token": "eyJhbG...",
  "user": {
    "role": "SUPERADMIN"
  }
}
```

Ili drugi format - vidi `BACKEND_FORMAT_CHECK.md`

---

## 📁 Šta Radi

### ✅ Sve stranice:
- Login
- Dashboard
- Users (SUPERADMIN)
- Experts (SUPERADMIN)
- Forum Categories (SUPERADMIN, ADMIN)
- Specializations (SUPERADMIN)
- Reported Posts (SUPERADMIN, ADMIN)
- Reported Comments (SUPERADMIN, ADMIN)
- HelpDesk Slots (SUPERADMIN)
- Slots (EXPERT)
- Meetings (SUPERADMIN, ADMIN)

### ✅ Funkcionalnosti:
- Role-based access
- JWT auth
- CRUD operacije
- Filtriranje
- Notifikacije
- Responsive

---

## 🐛 Common Issues

### "Cannot find module 'ajv'"

```powershell
npm install ajv@^8.12.0
```

### CORS Error

Backend CORS config:
```javascript
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true
}));
```

### "Cannot read properties of undefined (reading 'role')"

Backend ne vraća `role`. Provjeri `BACKEND_FORMAT_CHECK.md`

---

## 📚 Dokumentacija

- **`INSTALLATION_STEPS.md`** ⭐ - Detaljne instalacione korake
- **`test-backend.html`** ⭐ - Test backend
- **`BACKEND_FORMAT_CHECK.md`** - Backend format
- **`LOGIN_DEBUG.md`** - Login help
- **`README.md`** - Full docs

---

## ✅ Verzija 2.1 Changelog

- ✅ Fiksirane dependency verzije
- ✅ React 18.3.1 (stabilna)
- ✅ MUI 5.15.20 (kompatibilna)
- ✅ Sve dependencije usklađene
- ✅ Bez ajv greški
- ✅ Bez ERESOLVE konflikata

---

## 💡 Quick Check

Nakon `npm install`:

```powershell
npm start
```

Trebao bi vidjeti:
```
Compiled successfully!
Local: http://localhost:3000
```

Može biti warnings (ignoriši ih) - bitno da nema **ERRORS**!

---

## 🎉 Ready!

Sve dependencije su fiksirane! Sad bi trebalo da radi! 🚀

**Problem?** → Otvori `INSTALLATION_STEPS.md`
