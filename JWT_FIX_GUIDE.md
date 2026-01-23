# 🔐 JWT Token Fix - Backend Format

## Šta backend vraća:

```json
{
  "access_token": "eyJhbGc..."
}
```

**NE VRAĆA** `user` objekat!

## Rješenje: JWT Dekodiranje

Admin panel sada **automatski dekodira JWT token** i izvlači user podatke iz njega!

### Šta JWT token sadrži (decoded):

```json
{
  "sub": 1,              // User ID
  "email": "admin@...",
  "role": "SUPERADMIN",  // KLJUČNO!
  "iat": 1234567890,
  "exp": 1234567890
}
```

## Šta sam dodao u v2.3:

### 1. JWT Decoder (`src/utils/jwtDecode.ts`)

Funkcija koja dekodira JWT token bez dodatnih biblioteka.

### 2. Ažuriran `authService.login()`

Sada:
1. Prima `access_token` iz backend-a ✅
2. Automatski dekodira JWT ✅
3. Izvlači `role`, `email`, `id` iz payload-a ✅
4. Kreira `user` objekat ✅
5. Čuva u localStorage ✅

### 3. Console Logging

U Console-u ćeš vidjeti:
```
Raw API response: { access_token: "..." }
User object does not have role, attempting to decode JWT...
Decoded JWT: { sub: 1, email: "...", role: "SUPERADMIN", ... }
Created user from JWT: { id: 1, email: "...", role: "SUPERADMIN", ... }
Saved token: eyJhbGc...
Saved user: { id: 1, email: "...", role: "SUPERADMIN", ... }
```

## JWT Payload Mapiranje:

Admin panel traži ova polja u JWT-u:

| Admin očekuje | JWT može biti |
|---------------|---------------|
| `id` | `sub`, `userId`, `id` |
| `email` | `email` |
| `role` | `role`, `userRole` |
| `fullName` | `fullName`, `name` |
| `verified` | `verified` (default: true) |

## Testiranje:

```powershell
# 1. Instaliraj novu verziju
cd parentivo-admin
npm install

# 2. Pokreni
npm start

# 3. Uloguj se i provjeri Console
# Trebao bi vidjeti "Decoded JWT:" i "Created user from JWT:"
```

## Ako ne radi:

### JWT token nema `role` polje?

Provjeri svoj backend JWT payload. Mora imati jedno od:
- `role`
- `userRole`

Dodaj ga u JWT signing na backend-u:

```javascript
// Backend kod (Node.js primjer)
const token = jwt.sign({
  sub: user.id,
  email: user.email,
  role: user.role,  // ← OBAVEZNO!
  iat: Date.now(),
  exp: Date.now() + 3600000
}, JWT_SECRET);
```

### JWT format nije validan?

Provjeri da li token ima 3 dijela:
```
header.payload.signature
```

## Prednosti ovog rješenja:

✅ **Automatsko** - ne treba ručna konfiguracija
✅ **Fleksibilno** - podržava različite JWT formate
✅ **Bezbedno** - ne traži sensitive podatke
✅ **Console logging** - lako debugging

## Verzija 2.3 Changelog:

- ✅ Dodao JWT decoder
- ✅ Automatsko dekodiranje JWT-a
- ✅ Izvlačenje user podataka iz JWT payload-a
- ✅ Podržava `sub`, `userId`, `id` kao user ID
- ✅ Podržava `role`, `userRole` kao role field
- ✅ Console logging za debugging

**Sad bi trebalo da radi sa tvojim backend-om! 🚀**
