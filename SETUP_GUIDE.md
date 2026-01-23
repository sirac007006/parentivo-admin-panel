# Parentivo Admin Panel - Setup Guide

## 🚀 Brza instalacija (5 minuta)

### Korak 1: Raspakovati projekat

```bash
tar -xzf parentivo-admin.tar.gz
cd parentivo-admin
```

### Korak 2: Instalirati dependencije

```bash
npm install
```

### Korak 3: Konfigurisati API

Edituj `src/config.ts` i promijeni `API_BASE_URL`:

```typescript
export const API_BASE_URL = 'http://157.90.237.216:3333'; // Tvoj backend URL
```

### Korak 4: Pokrenuti aplikaciju

```bash
npm start
```

Aplikacija će biti dostupna na: **http://localhost:3000**

---

## 🔑 Prijava

Koristi `/auth/admin/login` endpoint za kreiranje admin naloga na backend-u.

Potrebne role:
- `SUPERADMIN` - pun pristup
- `ADMIN` - moderatorske funkcije
- `EXPERT` - samo termini

---

## 📁 Struktura projekta

```
parentivo-admin/
├── src/
│   ├── components/         # Reusable komponente
│   │   ├── Layout.tsx      # Glavni layout sa navigacijom
│   │   └── ProtectedRoute.tsx  # Route zaštita
│   ├── pages/              # Sve stranice
│   │   ├── Login.tsx
│   │   ├── Dashboard.tsx
│   │   ├── Users.tsx
│   │   ├── Experts.tsx
│   │   ├── ForumCategories.tsx
│   │   ├── Specializations.tsx
│   │   ├── ReportedPosts.tsx
│   │   ├── ReportedComments.tsx
│   │   ├── HelpDeskSlots.tsx
│   │   ├── Slots.tsx
│   │   └── Meetings.tsx
│   ├── services/           # API servisi
│   │   ├── authService.ts
│   │   └── apiService.ts
│   ├── config.ts           # Konfiguracija
│   ├── App.tsx             # Glavna app komponenta
│   └── index.tsx           # Entry point
├── package.json
└── README.md
```

---

## 🎯 Funkcionalnosti po roli

### SUPERADMIN

✅ **Korisnici** - Promjena role, brisanje  
✅ **Eksperti** - Postavljanje specijalizacija  
✅ **Specijalizacije** - CRUD operacije  
✅ **HelpDesk Termini** - Upravljanje terminima za čuvanje djece  
✅ **Forum Kategorije** - CRUD operacije  
✅ **Prijavljeni Postovi/Komentari** - Moderacija  
✅ **Online Radionice** - Kreiranje i pokretanje

### ADMIN

✅ **Forum Kategorije** - CRUD operacije  
✅ **Prijavljeni Postovi/Komentari** - Moderacija  
✅ **Online Radionice** - Kreiranje i pokretanje

### EXPERT

✅ **Moji Termini** - Kreiranje termina za konsultacije

---

## 🔧 Glavne tehnologije

- **React 18** sa TypeScript
- **Material-UI (MUI)** - UI framework
- **React Router** - Rutiranje
- **Axios** - HTTP klijent
- **React Toastify** - Notifikacije

---

## 📝 Primjeri korišćenja

### Kreiranje Forum Kategorije

1. Navigiraj na **Forum Kategorije**
2. Klikni **Nova Kategorija**
3. Popuni naziv i opis
4. Klikni **Sačuvaj**

### Promjena role korisnika

1. Navigiraj na **Korisnici**
2. Klikni **Edit** ikonicu pored korisnika
3. Izaberi novu rolu
4. Klikni **Sačuvaj**

### Pokretanje Online Radionice

1. Navigiraj na **Online Radionice**
2. Kreiraj novu radionicu sa naslovom, predavačem i vremenom
3. Kada dođe vrijeme, klikni **Play** ikonicu da pokreneš radionicu
4. Kada završi, klikni **Stop** ikonicu

---

## 🐛 Debugging

### Problem: Nema korisnika u listi

**Rješenje**: Provjeri da li backend vraća podatke. Otvori Console (F12) i pogledaj Network tab.

### Problem: 401 Unauthorized

**Rješenje**: Token je istekao ili nije validan. Izloguj se i ponovo se prijavi.

### Problem: CORS error

**Rješenje**: Backend mora dozvoliti CORS za frontend URL. Provjeri backend CORS konfiguraciju.

---

## 📦 Build za produkciju

```bash
npm run build
```

Build fajlovi će biti u `build/` folderu.

Možeš ih servirati sa bilo kojim web serverom:

```bash
npm install -g serve
serve -s build -p 3000
```

---

## 🔒 Sigurnost

⚠️ **Važno:**
- Koristi HTTPS u produkciji
- Ne dijeli admin kredencijale
- Redovno mijenjaj lozinke
- Implementiraj rate limiting na API-ju

---

## 📞 Pomoć

Za dodatna pitanja ili probleme, kontaktiraj razvojni tim.
