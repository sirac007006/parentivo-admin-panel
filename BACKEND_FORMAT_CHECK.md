# Provjera Backend Formata - Obavezno pročitaj!

## Kako provjeriti šta backend vraća

### Metoda 1: Koristi Swagger "Try it out"

1. Idi na: http://157.90.237.216:3333/api-docs (ili gdje ti je Swagger)
2. Nađi `/auth/admin/login` endpoint
3. Klikni "Try it out"
4. Unesi:
   ```json
   {
     "email": "superadmin@gmail.com",
     "password": "test12345"
   }
   ```
5. Klikni "Execute"
6. **PAZI NA RESPONSE** - kopiraj kompletan JSON

### Metoda 2: Browser Network Tab

1. Otvori admin panel (http://localhost:3000)
2. Otvori Browser Console (F12)
3. Idi na **Network** tab
4. Pokušaj da se uloguješ
5. Nađi zahtjev `/auth/admin/login`
6. Klikni na njega
7. Idi na **Response** tab
8. **KOPIRAJ KOMPLETAN JSON ODGOVOR**

### Metoda 3: Postman / Insomnia

```
POST http://157.90.237.216:3333/auth/admin/login
Content-Type: application/json

Body:
{
  "email": "superadmin@gmail.com",
  "password": "test12345"
}
```

Pošalji zahtjev i **kopiraj kompletan odgovor**.

---

## Šta admin panel OČEKUJE

Admin panel je fleksibilan i podržava **3 različita formata**:

### Format 1 (Standard - preporučeno):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "superadmin@gmail.com",
    "fullName": "Super Admin",
    "role": "SUPERADMIN",
    "verified": true,
    "createdAt": "2025-01-23T10:00:00.000Z",
    "updatedAt": "2025-01-23T10:00:00.000Z"
  }
}
```

### Format 2 (accessToken):
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "superadmin@gmail.com",
    "fullName": "Super Admin",
    "role": "SUPERADMIN",
    "verified": true
  }
}
```

### Format 3 (Flat struktura):
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "id": "550e8400-e29b-41d4-a716-446655440000",
  "email": "superadmin@gmail.com",
  "fullName": "Super Admin",
  "role": "SUPERADMIN",
  "verified": true,
  "createdAt": "2025-01-23T10:00:00.000Z",
  "updatedAt": "2025-01-23T10:00:00.000Z"
}
```

---

## ⚠️ KRITIČNO - Ova polja MORAJU postojati:

1. ✅ **token** ili **accessToken** - JWT string
2. ✅ **role** - mora biti: "SUPERADMIN", "ADMIN" ili "EXPERT"

Ostala polja su opciona, ali preporučena:
- `id` - korisnikov ID
- `email` - korisnikov email
- `fullName` - puno ime
- `verified` - da li je korisnik verifikovan

---

## Ako backend vraća DRUGAČIJI format

**OBAVEZNO mi javi** šta tačno backend vraća i ja ću prilagoditi kod!

Primjer: Ako backend vraća:
```json
{
  "data": {
    "accessToken": "...",
    "userInfo": {
      "userRole": "SUPERADMIN"
    }
  }
}
```

Javi mi i ja ću ažurirati `authService.ts` da parsira ovaj format.

---

## Debug u Browser Console-u

Kada pokušaš login, u Console-u ćeš vidjeti:

```
Raw API response: { ... } ← OVO JE KLJUČNO
Saved token: ...
Saved user: { ... }
```

Ako vidiš:
```
Login error: Token nije pronađen u odgovoru servera
```

To znači da backend ne vraća `token` ili `accessToken`.

Ako vidiš:
```
Login error: Korisnička rola nije pronađena u odgovoru servera
```

To znači da backend ne vraća `role` polje.

---

## Šta da uradiš SADA:

1. ✅ Prijavi se na admin panel
2. ✅ Otvori Console (F12)
3. ✅ Pokušaj login
4. ✅ **KOPIRAJ** cijeli output iz Console-a
5. ✅ **POŠALJI** mi ga
6. ✅ Ili kopiraj Response iz Network tab-a

Ja ću onda tačno vidjeti šta backend vraća i prilagoditi kod ako treba!

---

## Brza provjera - Backend radi?

Testiraj da li backend uopšte radi:

```bash
# Test health endpoint (ako postoji)
curl http://157.90.237.216:3333/health

# Ili basic test
curl http://157.90.237.216:3333/
```

Ako dobiješ odgovor, backend radi. Sada samo treba da vidimo šta `/auth/admin/login` vraća!
