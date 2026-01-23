# 🔧 VERZIJA 6.0 - MEETINGS FIX & EXPERT PRISTUP

## ✅ 1. MEETINGS (ONLINE RADIONICE) - Potpuna Popravka

**PROBLEM:**
- Invalid Date u tabeli
- Crashovalo kod izmjene

**RJEŠENJE:**
- ✅ Potpuno prepisan prema API rutama sa slike
- ✅ Koristi prave rute: `/meetings/admin`
- ✅ Defensive handling za sve datume
- ✅ Forma za kreiranje/izmjenu

**API RUTE:**
```
GET    /meetings/admin                  - Lista radionica (sa filterima)
POST   /meetings                        - Kreiranje nove radionice
PATCH  /meetings/{id}                   - Izmjena radionice
DELETE /meetings/{id}                   - Brisanje radionice
POST   /meetings/{id}/start             - Pokretanje radionice (isLive = true)
POST   /meetings/{id}/end               - Završavanje radionice (isLive = false)
```

**TABELA:**
```
| Naslov | Predavač | Planirano | Status | Akcije |
```

**FORMA POLJA:**
```json
{
  "title": "string *",              // Naslov radionice
  "description": "string",          // Opis
  "speakerName": "string *",        // Ime predavača
  "speakerBio": "string",           // Biografija predavača
  "scheduledAt": "ISO datetime *",  // Planirano vrijeme (ISO 8601)
  "isLive": boolean,                // Da li je radionica uživo
  "isActive": boolean               // Da li je radionica aktivna
}
```

**PRIMJER:**
```json
POST /meetings
{
  "title": "Uvod u NestJS i PostgreSQL",
  "description": "Detaljan opis radionice...",
  "speakerName": "Marko Marković",
  "speakerBio": "Senior backend developer...",
  "scheduledAt": "2026-01-25T18:00:00.000Z",
  "isLive": false,
  "isActive": true
}
```

**STATUS CHIPS:**
- 🟢 **LIVE** (zeleni) - Radionica je uživo
- 🔵 **Active** (plavi) - Radionica je aktivna
- ⚪ **Inactive** (sivi) - Radionica neaktivna

**AKCIJE:**
- ▶️  **Pokreni** (zeleni) - POST /meetings/{id}/start
- ⏹️  **Završi** (narandžasti) - POST /meetings/{id}/end
- ✏️  **Izmeni** (plavi)
- 🗑️  **Obriši** (crveni)

---

## ✅ 2. EXPERT PRISTUP - Kontrola i Debugging

**PROBLEM:**
- Ekspert se učitavao kao SUPERADMIN
- Ekspert mogao pristupiti svim stranicama

**RJEŠENJE:**

### A) Detaljno JWT Logovanje
```typescript
console.log('=== JWT DEBUGGING ===');
console.log('Full Decoded JWT:', decodedToken);
console.log('JWT Fields:');
console.log('- role:', decodedToken.role);
console.log('- userRole:', decodedToken.userRole);
console.log('- USER_ROLE:', decodedToken.USER_ROLE);
```

### B) Unauthorized Access Screen
Kada Expert pokuša pristupiti stranici kojoj nema pristup:
- ✅ Prikazuje se **Unauthorized Access** ekran
- ✅ Pokazuje trenutnu role
- ✅ Dugme "Nazad na Dashboard"

**Ekran prikazuje:**
```
🔒
Nemate Pristup

Vaša rola (EXPERT) nema pristup ovoj stranici.

Molimo vas kontaktirajte administratora ako mislite da je ovo greška.

[Nazad na Dashboard]
```

### C) Role Badge u Header-u
Top bar UVIJEK prikazuje trenutnu role:
- 🟣 **SUPERADMIN** (ljubičasti)
- 🔵 **ADMIN** (plavi)
- 🟢 **EXPERT** (zeleni)

---

## 🚨 BACKEND REQUIREMENTS - KRITIČNO!

### JWT TOKEN MORA IMATI `role` FIELD!

**Backend MORA vratiti JWT sa `role` fieldom:**
```json
{
  "sub": 1,
  "email": "expert@example.com",
  "role": "EXPERT",  ← OVO JE OBAVEZNO!
  "iat": 1234567890,
  "exp": 1234567990
}
```

**AKO BACKEND NE ŠALJE `role`:**
- ✅ Frontend će logovati ERROR u konzoli
- ✅ Defaultovaće na SUPERADMIN (fallback)
- ❌ **ALI TO JE GREŠKA - BACKEND MORA POSLATI ROLE!**

**Console output ako nema role:**
```
❌ ERROR: JWT TOKEN NEMA ROLE FIELD!
❌ Backend MORA dodati role u JWT token!
❌ Defaulting to SUPERADMIN as fallback...
```

**Console output ako ima role:**
```
✅ Role successfully extracted from JWT: EXPERT
```

---

## 📦 KAKO TESTIRATI ROLE?

### 1. Otvori Developer Tools (F12)
### 2. Idi na Console tab
### 3. Uloguj se kao Expert
### 4. Gledaj console output:

**Trebao bi vidjeti:**
```
=== JWT DEBUGGING ===
User object does not have role, attempting to decode JWT...
Full Decoded JWT: {
  "sub": 5,
  "email": "expert@gmail.com",
  "role": "EXPERT",  ← OVO MORA POSTOJATI!
  "iat": 1737641234,
  "exp": 1737727634
}
JWT Fields:
- sub: 5
- email: expert@gmail.com
- role: EXPERT  ← OVO MORA POSTOJATI!
- userRole: undefined
- USER_ROLE: undefined
✅ Role successfully extracted from JWT: EXPERT
```

**Ako vidiš ovo - BACKEND NE ŠALJE ROLE:**
```
❌ ERROR: JWT TOKEN NEMA ROLE FIELD!
❌ Backend MORA dodati role u JWT token!
```

---

## 🔐 EXPERT PRISTUP - Šta može Expert?

**Expert ima pristup SAMO:**
- ✅ Dashboard (osnoven pregled)
- ✅ Expert Termini (svoja stranica)

**Expert NEMA pristup:**
- ❌ Korisnici
- ❌ Eksperti
- ❌ Forum Kategorije
- ❌ Specijalizacije
- ❌ Prijavljeni Postovi
- ❌ Prijavljeni Komentari
- ❌ HelpDesk Termini
- ❌ Sastanci (Online Radionice)

**Ako Expert pokuša pristupiti:**
→ Prikazuje se "Nemate Pristup" ekran

---

## 📦 INSTALACIJA:

```powershell
# 1. STOP server
Ctrl+C

# 2. Raspakovati
cd C:\Users\Caretina\Desktop
tar -xzf parentivo-admin-v6.0-MEETINGS-FIX-EXPERT-ACCESS.tar.gz
cd parentivo-admin

# 3. Clean install
Remove-Item -Recurse -Force node_modules -ErrorAction SilentlyContinue
Remove-Item -Force package-lock.json -ErrorAction SilentlyContinue
npm install

# 4. Start
npm start
```

---

## 🧪 TESTIRANJE:

### Test 1: Meetings (Online Radionice)
1. Uloguj se kao SUPERADMIN
2. Idi na "Sastanci"
3. Klikni "Nova Radionica"
4. Popuni formu
5. Sačuvaj
6. **Provjeri:** Da li prikazuje "Invalid Date"? → NE!
7. Klikni "Izmeni"
8. **Provjeri:** Da li crashuje? → NE!

### Test 2: Expert Role Detection
1. Otvori F12 → Console
2. Uloguj se kao Expert
3. **Provjeri console output:**
   - Da li piše "✅ Role successfully extracted from JWT: EXPERT"?
   - Da li piše "❌ ERROR: JWT TOKEN NEMA ROLE FIELD!"?
4. Ako piše ERROR → **BACKEND NE ŠALJE ROLE U JWT!**

### Test 3: Expert Pristup
1. Uloguj se kao Expert
2. Pokušaj pristupiti "Korisnici"
3. **Provjeri:** Da li prikazuje "Nemate Pristup" ekran? → DA!
4. **Provjeri:** Da li top bar prikazuje "EXPERT" badge? → DA!

---

## ✅ POPRAVLJENO:

1. ✅ **Meetings** - Potpuna popravka, nema više Invalid Date
2. ✅ **JWT Debugging** - Detaljno logovanje u konzoli
3. ✅ **Unauthorized Screen** - Jasna poruka za neautorizovan pristup
4. ✅ **Role Badge** - Vizuelna oznaka u header-u
5. ✅ **Console Warnings** - Upozorenja ako backend ne šalje role

---

## 🚨 AKO I DALJE NE RADI:

**Problem je u BACKEND-u!**

Backend MORA u JWT token dodati `role` field:

```javascript
// Backend kod (Node.js/NestJS):
const payload = {
  sub: user.id,
  email: user.email,
  role: user.role,  // ← OVO JE KLJUČNO!
};

const token = jwt.sign(payload, secret, { expiresIn: '7d' });
```

**BEZ OVOGA, FRONTEND NE MOŽE ZNATI ROLE!**

---

## 💡 NAPOMENA:

Frontend sada ima MAKSIMALNU KOLIČINU LOGOVANJA!

Otvori console (F12) i uloguj se - vidjet ćeš tačno šta se dešava sa JWT tokenom i zašto se role ne prepoznaje (ako se ne prepoznaje).

Javi mi šta vidiš u console-u! 🔍
