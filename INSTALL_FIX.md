# Upustva za pokretanje Parentivo Admin Panel-a

## Problem sa dependency verzijama

Postoji konflikt između `@mui/material` i `@mui/icons-material` verzija.

## Rješenje

### Način 1: Koristi --legacy-peer-deps (Preporučeno)

```bash
# 1. Raspakovati projekat
tar -xzf parentivo-admin.tar.gz
cd parentivo-admin

# 2. Instalirati sa --legacy-peer-deps
npm install --legacy-peer-deps

# 3. Pokrenuti development server
npm start
```

### Način 2: Force instalacija

```bash
npm install --force
npm start
```

### Način 3: Fiksiraj package.json verzije

Edituj `package.json` i promijeni:

```json
"dependencies": {
  "@mui/material": "^5.15.0",
  "@mui/icons-material": "^5.15.0",
  ...
}
```

Zatim:
```bash
rm -rf node_modules package-lock.json
npm install
npm start
```

## Testiranje

Nakon pokretanja, aplikacija će biti dostupna na:
**http://localhost:3000**

## Production Build

```bash
npm run build --legacy-peer-deps
```

Build fajlovi će biti u `build/` folderu.

## Alternativa: Koristi yarn

```bash
yarn install
yarn start
```

Yarn bolje rješava peer dependency konflikte.

## TypeScript greške

TypeScript strict mode je isključen (`"strict": false` u tsconfig.json) da se izbjegnu type greške sa MUI Grid komponentom.

## Pomoć

Ako i dalje imaš probleme:
1. Provjeri Node.js verziju (preporučeno 16+)
2. Očisti npm cache: `npm cache clean --force`
3. Obriši node_modules i pokušaj ponovo

## Alternative MUI instalacija

Ako MUI pravi probleme, možeš koristiti tačne verzije koje rade zajedno:

```bash
npm uninstall @mui/material @mui/icons-material
npm install @mui/material@5.15.20 @mui/icons-material@5.15.20 --legacy-peer-deps
```
