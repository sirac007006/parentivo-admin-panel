# Deployment Uputstva za Parentivo Admin Panel

## Preduslovi

- Node.js 16+ i npm instaliran
- Pristup backend serveru

## Lokalno pokretanje

### 1. Raspakovati arhivu

```bash
tar -xzf parentivo-admin.tar.gz
cd parentivo-admin
```

### 2. Instalirati dependencije

```bash
npm install
```

### 3. Konfigurisati API endpoint

Edituj `src/config.ts` i postavi tačan API URL:

```typescript
export const API_BASE_URL = 'http://tvoj-backend-url:3333';
```

### 4. Pokrenuti development server

```bash
npm start
```

Aplikacija će biti dostupna na `http://localhost:3000`

## Build za produkciju

### 1. Napraviti production build

```bash
npm run build
```

Build će biti u `build/` folderu.

### 2. Serviranje build-a

Možeš koristiti bilo koji web server za serviranje statičkih fajlova:

#### Korišćenje serve paketa (preporuka za testiranje)

```bash
npm install -g serve
serve -s build -p 3000
```

#### Nginx konfiguracija

```nginx
server {
    listen 80;
    server_name your-domain.com;
    root /path/to/parentivo-admin/build;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    # API proxy (opciono, ako želiš da izbegneš CORS)
    location /api {
        proxy_pass http://backend-server:3333;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

## Docker deployment (opciono)

### 1. Kreirati Dockerfile

```dockerfile
# Build stage
FROM node:16-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

### 2. Kreirati nginx.conf

```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:3333;
    }
}
```

### 3. Build i run Docker container

```bash
docker build -t parentivo-admin .
docker run -p 80:80 parentivo-admin
```

## Environment Variables

Ako želiš da koristiš environment variable za API URL, možeš napraviti `.env` fajl:

```
REACT_APP_API_URL=http://your-backend-url:3333
```

Onda u `src/config.ts`:

```typescript
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3333';
```

## Troubleshooting

### Problem: API ne radi / CORS error

**Rešenje**: Osiguraj da backend ima pravilno konfigurisane CORS headere ili konfiguriši proxy u nginx-u.

### Problem: 404 na refresh stranice

**Rešenje**: Osiguraj da web server vraća `index.html` za sve rute koje nisu statički fajlovi (pogledaj nginx konfiguraciju iznad).

### Problem: Bela stranica nakon build-a

**Rešenje**: Provjeri da li je `homepage` u `package.json` pravilno postavljen:

```json
"homepage": "."
```

### Problem: Token nestaje nakon refresh-a

**Rešenje**: Token se čuva u localStorage, osiguraj da browser nema blokirane cookies/storage.

## Security Checklist

- [ ] HTTPS je obavezan u produkciji
- [ ] API_BASE_URL pokazuje na HTTPS backend
- [ ] CORS je pravilno konfigurisan
- [ ] Environment varijable ne sadrže osetljive podatke
- [ ] Nginx/web server ima security headers (X-Frame-Options, CSP, itd.)
- [ ] Rate limiting je implementiran na API nivou

## Maintenance

### Update dependencies

```bash
npm update
npm audit fix
```

### Backup

Redovno pravi backup localStorage podataka i log fajlova.

## Support

Za dodatnu pomoć, kontaktiraj razvojni tim ili otvori issue na projektu.
