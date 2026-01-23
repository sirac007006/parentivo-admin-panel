# Parentivo Admin Panel

Admin panel za upravljanje Parentivo aplikacijom.

## Tehnologije

- React 18 sa TypeScript
- Material-UI (MUI) za UI komponente
- React Router za rutiranje
- Axios za API pozive
- React Toastify za notifikacije

## Instalacija i pokretanje

### Instalacija dependencija

```bash
cd parentivo-admin
npm install
```

### Pokretanje development servera

```bash
npm start
```

Aplikacija će biti dostupna na `http://localhost:3000`

### Build za produkciju

```bash
npm run build
```

## Konfiguracija

API konfiguracija se nalazi u `src/config.ts`. Podesi `API_BASE_URL` prema svom backend serveru:

```typescript
export const API_BASE_URL = 'http://157.90.237.216:3333';
```

## Autentifikacija

Admin panel koristi `/auth/admin/login` endpoint za prijavu. Potrebno je imati jednu od sledećih rola:
- SUPERADMIN
- ADMIN
- EXPERT

## Moduli i permisije

### SUPERADMIN

- **Korisnici** (`/users`)
  - Pregled svih korisnika
  - Filtriranje po imenu, emailu, roli, verifikaciji
  - Promjena role korisnika
  - Brisanje korisnika

- **Eksperti** (`/experts`)
  - Pregled svih eksperata
  - Filtriranje po imenu, emailu, specijalizaciji
  - Postavljanje specijalizacije ekspertima
  - Brisanje eksperata

- **Specijalizacije** (`/specializations`)
  - Kreiranje novih specijalizacija
  - Editovanje postojećih
  - Brisanje specijalizacija

- **HelpDesk Termini** (`/helpdesk-slots`)
  - Kreiranje termina za čuvanje djece
  - Editovanje termina
  - Brisanje termina

### ADMIN

- **Forum Kategorije** (`/forum-categories`)
  - Kreiranje novih forum kategorija
  - Editovanje postojećih
  - Brisanje kategorija

- **Prijavljeni Postovi** (`/reported-posts`)
  - Pregled prijavljenih postova
  - Brisanje prijave
  - Brisanje samog posta

- **Prijavljeni Komentari** (`/reported-comments`)
  - Pregled prijavljenih komentara
  - Brisanje prijave
  - Brisanje komentara

- **Online Radionice** (`/meetings`)
  - Kreiranje online radionica
  - Editovanje radionica
  - Pokretanje radionice (start)
  - Završavanje radionice (end)
  - Brisanje radionice

### EXPERT

- **Moji Termini** (`/slots`)
  - Kreiranje svojih termina za konsultacije
  - Editovanje termina (samo ako nisu zakazani)
  - Brisanje termina (samo ako nisu zakazani)

## Struktura projekta

```
src/
├── components/
│   ├── Layout.tsx          # Glavni layout sa sidebar navigacijom
│   └── ProtectedRoute.tsx  # Zaštita ruta sa role-based access
├── pages/
│   ├── Login.tsx           # Login stranica
│   ├── Dashboard.tsx       # Početna stranica
│   ├── Users.tsx           # Upravljanje korisnicima
│   ├── Experts.tsx         # Upravljanje ekspertima
│   ├── ForumCategories.tsx # Upravljanje forum kategorijama
│   ├── Specializations.tsx # Upravljanje specijalizacijama
│   ├── ReportedPosts.tsx   # Prijavljeni postovi
│   ├── ReportedComments.tsx# Prijavljeni komentari
│   ├── HelpDeskSlots.tsx   # HelpDesk termini
│   ├── Slots.tsx           # Termini eksperata
│   └── Meetings.tsx        # Online radionice
├── services/
│   ├── authService.ts      # Autentifikacija i token management
│   └── apiService.ts       # API pozivi za sve entitete
├── config.ts               # Konfiguracija API-ja
└── App.tsx                 # Glavna aplikacija sa rutama
```

## Features

- ✅ Role-based access control (SUPERADMIN, ADMIN, EXPERT)
- ✅ JWT authentication sa Bearer token
- ✅ Responsive design (desktop i mobilni)
- ✅ Real-time notifikacije (toast)
- ✅ Filtriranje i pretraga
- ✅ CRUD operacije za sve entitete
- ✅ Potvrda brisanja
- ✅ Validacija formi
- ✅ Error handling

## Napomene

- Token se čuva u localStorage
- Automatsko preusmeravanje na login pri 401 erroru
- Sidebar navigacija prikazuje samo dozvoljene module za ulogovanog korisnika
- Svi datumi i vremena se prikazuju u lokalnom formatu
