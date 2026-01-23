# Login Debug Uputstva

## Problem: "Cannot read properties of undefined (reading 'role')"

Ova greška se dešava kada backend vraća odgovor u neočekivanom formatu.

## Šta sam popravio:

### 1. authService.ts - Fleksibilnije rukovanje odgovorom

```typescript
// Sada podržava različite formate:
// Format 1: { token: "...", user: { role: "..." } }
// Format 2: { accessToken: "...", user: { role: "..." } }
// Format 3: { token: "...", role: "..." } (bez user objekta)
```

### 2. Login.tsx - Dodatna validacija

Dodao sam:
- Console logging za debugging
- Provjeru različitih formata odgovora
- Bolju error poruku

### 3. Layout.tsx - Auto redirect

Ako nema user podataka, automatski redirect na login.

## Kako debugovati:

### Korak 1: Otvori Browser Console (F12)

Kada pokušaš da se uloguješ, pogledaj Console output.

### Korak 2: Provjeri šta backend vraća

U Console-u će biti:
```
Raw API response: { ... }
Saved token: ...
Saved user: { ... }
```

### Korak 3: Provjeri format odgovora

Backend **MORA** vratiti:

**Opcija 1 (preporučeno):**
```json
{
  "token": "eyJhbGc...",
  "user": {
    "id": "123",
    "email": "admin@example.com",
    "fullName": "Admin User",
    "role": "SUPERADMIN",
    "verified": true
  }
}
```

**Opcija 2:**
```json
{
  "accessToken": "eyJhbGc...",
  "user": {
    "role": "SUPERADMIN",
    ...
  }
}
```

**Opcija 3 (flat struktura):**
```json
{
  "token": "eyJhbGc...",
  "id": "123",
  "email": "admin@example.com",
  "role": "SUPERADMIN",
  ...
}
```

## Ako i dalje ne radi:

### Provjeri backend endpoint

```bash
curl -X POST http://157.90.237.216:3333/auth/admin/login \
  -H "Content-Type: application/json" \
  -d '{"email":"superadmin@gmail.com","password":"test123"}'
```

Provjeri tačan format odgovora i javi mi ako je različit od očekivanog.

### Provjeri da li backend postavlja pravilan Content-Type

Backend mora vratiti:
```
Content-Type: application/json
```

### Provjeri CORS

Ako vidiš CORS error u Console-u, backend mora dozvoliti:
```javascript
Access-Control-Allow-Origin: http://localhost:3000
Access-Control-Allow-Methods: POST, GET, PATCH, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
```

## Brzi test backend-a

Napravi test fajl `test-login.js`:

```javascript
const axios = require('axios');

axios.post('http://157.90.237.216:3333/auth/admin/login', {
  email: 'superadmin@gmail.com',
  password: 'test123'
})
.then(response => {
  console.log('Success!');
  console.log(JSON.stringify(response.data, null, 2));
})
.catch(error => {
  console.log('Error!');
  console.log(error.response?.data || error.message);
});
```

Pokreni:
```bash
node test-login.js
```

## Dodatne provjere:

1. ✅ Da li backend radi? (`curl http://157.90.237.216:3333`)
2. ✅ Da li korisnik postoji u bazi?
3. ✅ Da li korisnik ima rolu SUPERADMIN, ADMIN ili EXPERT?
4. ✅ Da li je korisnik verified?

## Najčešći problemi:

### Problem 1: Backend ne vraća `role` field
**Rješenje:** Dodaj `role` u backend user model

### Problem 2: Token nije validan format
**Rješenje:** Provjeri JWT secret i signing na backend-u

### Problem 3: CORS blokira zahtjev
**Rješenje:** Dodaj CORS middleware na backend

### Problem 4: Email/password netačni
**Rješenje:** Provjeri kredencijale u bazi

## Contact za pomoć:

Ako i dalje ne radi, pošalji mi:
1. Console output iz browsera
2. Network tab - response za `/auth/admin/login`
3. Backend kod za admin login endpoint
