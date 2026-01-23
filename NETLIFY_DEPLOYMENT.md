# 🚀 NETLIFY DEPLOYMENT GUIDE

## 📋 PRE-DEPLOYMENT CHECKLIST

Prije nego što push-uješ na GitHub, provjeri:

✅ `.env` fajl postoji (ali NE commit-uj ga!)
✅ `.env.example` postoji i commit-ovan
✅ `package.json` ima `"build": "react-scripts build"`
✅ `package-lock.json` postoji i commit-ovan
✅ `.nvmrc` postoji (Node 18)
✅ `netlify.toml` postoji
✅ Svi ESLint errors riješeni

---

## 🔧 NETLIFY BUILD SETTINGS

### 1. Basic Build Settings:
```
Branch to deploy: master
Base directory: (leave empty)
Build command: npm run build
Publish directory: build
```

### 2. Environment Variables (OBAVEZNO!):

Idi na: **Site settings → Build & deploy → Environment**

Dodaj:
```
REACT_APP_API_BASE_URL = https://api.parentivo.online
REACT_APP_API_TIMEOUT = 30000
```

**VAŽNO:** Bez ovih env varijabli, build će uspjeti ALI aplikacija neće raditi!

---

## 📁 FAJLOVI UKLJUČENI U BUILD

### ✅ Commit-ovani (u GitHub):
- `package.json` - Dependencies i build script
- `package-lock.json` - Locked versions
- `.nvmrc` - Node version (18)
- `netlify.toml` - Build config
- `.env.example` - Template za env variables
- `.gitignore` - Excludes .env
- Svi `src/` fajlovi

### ❌ NE commit-uj:
- `.env` - Sadrži API URL (ignored u .gitignore)
- `node_modules/` - Dependencies (install-uje se na build)
- `build/` - Build output
- `.DS_Store`, `*.log`

---

## 🛠️ netlify.toml Objašnjenje

```toml
[build]
  command = "npm run build"       # Build komanda
  publish = "build"               # Folder za deploy
  
[build.environment]
  NODE_VERSION = "18"             # Node 18
  NPM_FLAGS = "--legacy-peer-deps" # Compatibility fix
  CI = "false"                    # Ne tretiraj warnings kao errors
  
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200                    # SPA routing support
```

---

## 🚀 DEPLOYMENT FLOW

### 1. Lokalno:
```bash
# Testiraj build
npm run build

# Trebao bi proći! ✅
```

### 2. Push na GitHub:
```bash
git add .
git commit -m "Ready for deployment"
git push origin master
```

### 3. Netlify automatski:
```
1. Detektuje push na master
2. Pull-uje kod
3. Čita netlify.toml
4. Postavlja NODE_VERSION=18
5. Runs: npm install --legacy-peer-deps
6. Čita env variables iz Netlify UI
7. Runs: npm run build (sa env vars)
8. Deploy-uje build/ folder
9. Aplikacija LIVE! 🎉
```

---

## 🔍 COMMON ISSUES & SOLUTIONS

### Issue 1: "Module not found"
**Problem:** Import file-a izvan `src/`  
**Solution:** Move file u `src/` ili promijeni import path

### Issue 2: "Build failed" - ESLint errors
**Problem:** ESLint tretira warnings kao errors  
**Solution:** `CI=false` u netlify.toml (već dodato!)

### Issue 3: "npm ERR! peer dependency"
**Problem:** Incompatible peer dependencies  
**Solution:** `NPM_FLAGS="--legacy-peer-deps"` (već dodato!)

### Issue 4: Aplikacija se build-uje ali ne radi
**Problem:** Env variables nisu postavljene  
**Solution:** Dodaj u Netlify UI:
```
REACT_APP_API_BASE_URL = https://api.parentivo.online
```

### Issue 5: 404 na refresh
**Problem:** SPA routing nije configurisan  
**Solution:** `[[redirects]]` u netlify.toml (već dodato!)

### Issue 6: Wrong Node version
**Problem:** Netlify koristi stari Node  
**Solution:** `.nvmrc` i `NODE_VERSION` u netlify.toml (već dodato!)

---

## 📊 BUILD LOG READING

### Uspješan Build:
```
1:23:45 PM: Build ready to start
1:23:47 PM: Installing dependencies
1:23:50 PM: Installing NPM modules using NPM version 9.6.7
1:24:15 PM: Dependencies installed
1:24:15 PM: Started restoring cached build plugins
1:24:16 PM: Running "npm run build"
1:24:45 PM: Compiled successfully!
1:24:45 PM: File sizes after gzip:
1:24:46 PM: Site is live ✨
```

### Failed Build - Tražiti:
```
- "Module not found" → Import problem
- "ESLint error" → Code quality issue
- "npm ERR!" → Dependency problem
- "ELIFECYCLE" → Build command failed
```

---

## ✅ POST-DEPLOYMENT PROVJERE

Nakon što Netlify deploya:

1. **Test Login:**
   ```
   URL: https://your-site.netlify.app
   Login sa: superadmin@gmail.com
   ```

2. **Console Check (F12):**
   ```javascript
   console.log(process.env.REACT_APP_API_BASE_URL);
   // Trebalo bi: https://api.parentivo.online
   ```

3. **Network Tab:**
   - Provjeri da li API pozivi idu na `https://api.parentivo.online`
   - Ne na `localhost` ili `157.90.237.216`

4. **Test Functionality:**
   - ✅ Login radi
   - ✅ Dashboard učitava
   - ✅ API pozivi uspijevaju
   - ✅ Expert role detection radi

---

## 🔄 RE-DEPLOY

Za redeploy nakon izmjena:

```bash
# 1. Napravi izmjene
# 2. Commit
git add .
git commit -m "Update: ..."

# 3. Push
git push origin master

# 4. Netlify automatski re-deploya! 🚀
```

---

## 🎯 FINAL CHECKLIST PRIJE PRVOG DEPLOYA

- [ ] `netlify.toml` commit-ovan
- [ ] `.nvmrc` commit-ovan
- [ ] `package.json` ima engines field
- [ ] `package-lock.json` commit-ovan
- [ ] `.env.example` commit-ovan
- [ ] `.env` je u `.gitignore` (NE commit!)
- [ ] Lokalni build radi: `npm run build` ✅
- [ ] Netlify env variables postavljene:
  - [ ] `REACT_APP_API_BASE_URL`
  - [ ] `REACT_APP_API_TIMEOUT`
- [ ] Push na GitHub
- [ ] Provjeri Netlify build log

---

## 📞 SUPPORT

Ako build fail-uje:
1. Kopiraj CIJELI build log iz Netlify
2. Traži error liniju (crveni tekst)
3. Provjeri ovaj guide za solution

---

**READY ZA DEPLOYMENT! 🚀**
