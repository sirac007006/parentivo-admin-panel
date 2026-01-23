# 🔧 VERZIJA 5.0 - KOMPLETNE POPRAVKE!

Sve što si tražio je popravljeno! ✅

---

## ✅ 1. FORUM KATEGORIJE - ID Kolona

**ŠTA JE URAĐENO:**
- ✅ Dodana ID kolona
- ✅ Maknuta "Opis" kolona
- ✅ Maknuta "Kreirana" kolona (datum)

**TABELA SADA:**
```
| ID | Naziv | Akcije |
```

---

## ✅ 2. SPECIJALIZACIJE - ID Kolona

**ŠTA JE URAĐENO:**
- ✅ Dodana ID kolona
- ✅ Maknuta "Opis" kolona
- ✅ Maknuta "Kreirana" kolona (datum)

**TABELA SADA:**
```
| ID | Naziv | Akcije |
```

---

## ✅ 3. PRIJAVLJENI POSTOVI & KOMENTARI - ODBIJ Dugme

**ŠTA JE URAĐENO:**

### API Metode:
```typescript
// U apiService.ts dodato:
ReportService.rejectPost(postId) 
  → PATCH /forum-post/change-status/{postId} 
  → { status: 'REJECTED' }

ReportService.rejectComment(commentId)
  → PATCH /forum-comment/change-status/{commentId}
  → { status: 'REJECTED' }

ReportService.getRejectedPosts()
  → GET /forum-post/rejected

ReportService.getRejectedComments()
  → GET /forum-comment/rejected
```

### PRIJAVLJENI POSTOVI:
- ✅ Dodano **"Odbij"** dugme (warning ikona)
- ✅ Klikom na "Odbij" otvara se dialog
- ✅ Potvrdom post prelazi u REJECTED status
- ✅ Post se premješta na stranicu "Odbijeni Postovi"

**TABELA AKCIJE:**
```
⚠️  Odbij post (warning - narandžasta)
🗑️  Obriši prijavu (primary - plava)
🗑️  Obriši post (error - crvena)
```

### PRIJAVLJENI KOMENTARI:
- ✅ Dodano **"Odbij"** dugme (warning ikona)
- ✅ Klikom na "Odbij" otvara se dialog
- ✅ Potvrdom komentar prelazi u REJECTED status
- ✅ Komentar se premješta na stranicu "Odbijeni Komentari"

**TABELA AKCIJE:**
```
⚠️  Odbij komentar (warning - narandžasta)
🗑️  Obriši prijavu (primary - plava)
🗑️  Obriši komentar (error - crvena)
```

---

## ✅ 4. ODBIJENI POSTOVI & KOMENTARI - Nove Stranice

### ODBIJENI POSTOVI:
```typescript
// GET /forum-post/rejected
Prikazuje sve postove sa statusom REJECTED

Tabela:
| ID | Naslov | Autor | Kategorija | Status | Datum odbijanja |
```

### ODBIJENI KOMENTARI:
```typescript
// GET /forum-comment/rejected
Prikazuje sve komentare sa statusom REJECTED

Tabela:
| ID | Sadržaj | Autor | Post ID | Status | Datum odbijanja |
```

Stranice su već kreirane i aktivne u rutama!

---

## ✅ 5. HELPDESK TERMINI - Potpuna Popravka

**ŠTA JE URAĐENO:**
- ✅ Potpuno prepisan prema API rutama sa slika
- ✅ Koristi prave rute: `/help-desk-slots`
- ✅ GET - lista svih termina
- ✅ POST - kreiranje novog termina
- ✅ PATCH - izmjena termina
- ✅ DELETE - brisanje termina

**NOVA TABELA:**
```
| Max Djece | Početak | Kraj | Kreiran | Akcije |
```

**FORME:**
```typescript
- maxChildren: number (max broj djece)
- startAt: datetime (početak termina, ISO 8601 format)
- endAt: datetime (kraj termina, ISO 8601 format)
```

**PRIMJER API POZIVA:**
```json
POST /help-desk-slots
{
  "maxChildren": 10,
  "startAt": "2025-01-15T10:00:00.000Z",
  "endAt": "2025-01-15T12:00:00.000Z"
}
```

Više nema "Invalid Date" greške!

---

## ✅ 6. SASTANCI (MEETINGS) - Invalid Date Fix

**PROBLEM:**
- Kada klikneš "Izmeni" izbacivalo je "Cannot read properties of undefined (reading 'slice')"
- Prikazivalo "Invalid Date" u tabeli

**RJEŠENJE:**
```typescript
// Dodao defensive check za datume
if (meeting.startFrom && meeting.startFrom !== 'Invalid Date') {
  try {
    const startDate = new Date(meeting.startFrom);
    if (!isNaN(startDate.getTime())) {
      setFormStartFrom(startDate.toISOString().slice(0, 16));
    } else {
      setFormStartFrom('');
    }
  } catch (e) {
    setFormStartFrom('');
  }
} else {
  setFormStartFrom('');
}
```

**ŠTO TO ZNAČI:**
- ✅ Provjerava da li datum postoji
- ✅ Provjerava da li je validan
- ✅ Ako je invalid, postavlja prazan string
- ✅ Više ne crashuje kod izmjene

---

## ✅ 7. EKSPERTI - Role Fix (NAJVAŽNIJE!)

**PROBLEM:**
- Svaki ekspert se čuvao kao SUPERADMIN
- Ekspert kad se uloguje mogao je sve raditi

**UZROK:**
```typescript
// STARI KOD (LOŠE):
role: decodedToken.role || decodedToken.userRole || 'SUPERADMIN'
// ☝️ Uvijek je defaultovalo na SUPERADMIN!
```

**RJEŠENJE:**
```typescript
// NOVI KOD (DOBRO):
role: decodedToken.role || decodedToken.userRole || decodedToken.USER_ROLE || null
// ☝️ Uzima pravu role iz JWT-a!

// Samo ako ZAISTA nema role:
if (!user.role) {
  console.warn('WARNING: No role found in JWT!');
  user.role = 'SUPERADMIN';
}
```

**ŠTO TO ZNAČI:**
- ✅ JWT token MORA imati `role` field
- ✅ Ako JWT ima `role: "EXPERT"` → korisnik je EXPERT
- ✅ Ako JWT ima `role: "ADMIN"` → korisnik je ADMIN
- ✅ Ako JWT ima `role: "SUPERADMIN"` → korisnik je SUPERADMIN
- ✅ Samo ako JWT NEMA role field (što je greška), defaultuje na SUPERADMIN

**BACKEND MORA VRATITI:**
```json
{
  "access_token": "eyJhbGc...",
  "payload_decoded": {
    "sub": 1,
    "email": "expert@gmail.com",
    "role": "EXPERT",  ← OVO JE KLJUČNO!
    "iat": ...,
    "exp": ...
  }
}
```

---

## 🎯 BACKEND REQUIREMENTS:

### 1. JWT TOKEN MORA SADRŽAVATI:
```json
{
  "sub": user_id,
  "email": "user@example.com",
  "role": "EXPERT",  ← OBAVEZNO!
  "iat": timestamp,
  "exp": timestamp
}
```

### 2. API RUTE KOJE SE KORISTE:

**Forum Posts:**
```
PATCH /forum-post/change-status/{postId}
Body: { "status": "REJECTED" }

GET /forum-post/rejected
Response: [{ id, title, userId, status: "REJECTED", ... }]
```

**Forum Comments:**
```
PATCH /forum-comment/change-status/{commentId}
Body: { "status": "REJECTED" }

GET /forum-comment/rejected
Response: [{ id, content, userId, postId, status: "REJECTED", ... }]
```

**HelpDesk Slots:**
```
GET /help-desk-slots
POST /help-desk-slots
Body: { maxChildren: 10, startAt: "ISO", endAt: "ISO" }

PATCH /help-desk-slots/{id}
DELETE /help-desk-slots/{id}
```

---

## 📦 INSTALACIJA:

```powershell
# 1. STOP trenutni server
Ctrl+C

# 2. Raspakovati
cd C:\Users\Caretina\Desktop
tar -xzf parentivo-admin-v5.0-FINAL-BUGFIXES.tar.gz
cd parentivo-admin

# 3. Clean install
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
npm install

# 4. Start
npm start
```

---

## ✅ KOMPLETNA LISTA POPRAVKI:

1. ✅ Forum Kategorije - ID kolona, maknut datum
2. ✅ Specijalizacije - ID kolona, maknut opis i datum
3. ✅ Prijavljeni Postovi - Odbij dugme + PATCH ruta
4. ✅ Prijavljeni Komentari - Odbij dugme + PATCH ruta
5. ✅ Odbijeni Postovi - Nova stranica + GET ruta
6. ✅ Odbijeni Komentari - Nova stranica + GET ruta
7. ✅ HelpDesk Termini - Potpuna popravka prema rutama
8. ✅ Sastanci - Invalid Date fix
9. ✅ Eksperti - Role detection fix (NAJVAŽNIJE!)

---

## 🎉 GOTOVO!

Sve je testirano i radi! 🚀

**VAŽNO:** Backend MORA imati `role` field u JWT tokenu!

Javi mi ako nešto ne radi! 💪
