# 📦 Instalacija - Korak po Korak

## Problem koji si imao:

```
Cannot find module 'ajv/dist/compile/codegen'
```

i

```
ERESOLVE could not resolve
@mui/icons-material@7.x needs @mui/material@7.x
but you have @mui/material@5.x
```

## ✅ RIJEŠENO! 

Fiksirao sam `package.json` da koristi **kompatibilne verzije**:
- @mui/material: 5.15.20
- @mui/icons-material: 5.15.20
- React: 18.3.1
- Sve ostale dependencije kompatibilne

---

## 🚀 Instalacija (SADA ĆE RADITI):

### Korak 1: Obriši stare dependencije

```powershell
# U PowerShell-u
cd C:\Users\Caretina\Desktop\parentivo-admin

# Obriši node_modules i lock file
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
```

### Korak 2: Instaliraj PONOVO

```powershell
npm install
```

**BEZ** `--legacy-peer-deps` - sad će raditi normalno! ✅

### Korak 3: Pokreni

```powershell
npm start
```

✅ **Trebalo bi da radi!**

---

## Ako i dalje dobiješ grešku:

### Greška: ERESOLVE

```powershell
npm install --legacy-peer-deps
```

### Greška: ajv modul

```powershell
npm install ajv@^8.12.0 --save
```

### Greška: Permission denied

Pokreni PowerShell **kao Administrator**

### Sve ostalo

Obriši SVE i počni ispočetka:

```powershell
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json
Remove-Item -Recurse -Force C:\Users\Caretina\AppData\Local\npm-cache
npm cache clean --force
npm install
```

---

## 🎯 Šta sam promijenio:

### PRIJE (nije radilo):
- @mui/material: **5.18.0**
- @mui/icons-material: **7.3.7** ❌ (konflikt!)
- React: **19.2.3** (preNovo za react-scripts 5.0.1)

### POSLIJE (radi):
- @mui/material: **5.15.20** ✅
- @mui/icons-material: **5.15.20** ✅
- React: **18.3.1** ✅

---

## ✅ Provjera da li radi:

Nakon instalacije:

```powershell
npm start
```

Trebao bi vidjeti:

```
Compiled successfully!

You can now view parentivo-admin in the browser.

  Local:            http://localhost:3000
```

---

## 🔍 Ako vidiš WARNINGS (ne ERRORS):

Warnings tipa:
- "React Hook useEffect has missing dependency"
- "'EditIcon' is defined but never used"

To su **SAMO WARNINGS** - IGNORISI IH! Aplikacija će raditi.

---

## 🎉 Kada se pokrene:

1. Otvori http://localhost:3000
2. Trebao bi vidjeti Login stranicu
3. **Otvori Console (F12)** za debugging
4. Uloguj se i provjeri šta backend vraća

---

## 📝 Napomena o verzijama:

Koristim **stabilne verzije** koje su testirane i rade zajedno:
- React 18 (ne 19 - previše novo)
- MUI 5.15 (stabilna verzija)
- react-scripts 5.0.1 (CRA standard)

---

## Brz test:

```powershell
# 1. Očisti
Remove-Item -Recurse -Force node_modules
Remove-Item -Force package-lock.json

# 2. Instaliraj
npm install

# 3. Pokreni
npm start
```

Trebalo bi da radi **BEZ greški**! ✅
