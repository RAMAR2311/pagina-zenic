# Despliegue de ZENIC en VPS Ubuntu (Hostinger)

Guía para publicar el sitio (frontend React + backend Express/SQLite) en un servidor
Ubuntu 24.04. Arquitectura: **Nginx** sirve el sitio compilado y hace de proxy de
`/api` y `/uploads` hacia el **backend Node** (gestionado con **PM2**).

> Sustituye `TU_DOMINIO` por tu dominio (ej. `zenic.com.co`) o usa la IP `187.124.210.253`.

---

## 1. Instalar dependencias del sistema (una sola vez)

```bash
# Node.js 20 LTS
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# Herramientas de compilación (better-sqlite3) + git + nginx
sudo apt-get install -y build-essential python3 git nginx

# PM2 (mantiene el backend corriendo y lo reinicia solo)
sudo npm install -g pm2

node -v && npm -v   # verifica
```

---

## 2. Clonar el proyecto

```bash
cd /var/www
git clone https://github.com/RAMAR2311/pagina-zenic.git zenic
cd zenic
```

---

## 3. Instalar y compilar

```bash
npm install
npm run build      # genera la carpeta dist/
```

---

## 4. Arrancar el backend con PM2

El backend escucha en el puerto **4000** (cámbialo con `PORT` si está ocupado).

```bash
cd /var/www/zenic
PORT=4000 pm2 start server/index.js --name zenic-api

pm2 save            # guarda el proceso
pm2 startup         # ejecuta el comando que imprime para arrancar al reiniciar el VPS
```

Comprueba: `curl http://localhost:4000/api/content` debe responder JSON.

---

## 5. Configurar Nginx

```bash
sudo nano /etc/nginx/sites-available/zenic
```

Pega esto (ajusta `server_name`):

```nginx
server {
    listen 80;
    server_name TU_DOMINIO www.TU_DOMINIO;   # o la IP 187.124.210.253

    root /var/www/zenic/dist;
    index index.html;

    # Frontend (SPA) — todas las rutas caen en index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # API del backend
    location /api/ {
        proxy_pass http://localhost:4000;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }

    # Imágenes subidas desde el admin
    location /uploads/ {
        proxy_pass http://localhost:4000;
        proxy_set_header Host $host;
    }

    client_max_body_size 10M;   # permite subir imágenes
}
```

Activa el sitio y recarga:

```bash
sudo ln -s /etc/nginx/sites-available/zenic /etc/nginx/sites-enabled/zenic
sudo nginx -t          # prueba la config
sudo systemctl reload nginx
```

Ya deberías ver el sitio en `http://TU_DOMINIO` (o `http://187.124.210.253`).

---

## 6. HTTPS gratis con Let's Encrypt (recomendado, requiere dominio)

```bash
sudo apt-get install -y certbot python3-certbot-nginx
sudo certbot --nginx -d TU_DOMINIO -d www.TU_DOMINIO
```

Certbot edita la config de Nginx y renueva el certificado automáticamente.

---

## 7. Actualizar el sitio cuando haya cambios

```bash
cd /var/www/zenic
git pull
npm install        # solo si cambiaron dependencias
npm run build
pm2 restart zenic-api
```

> `git pull` **no** borra tu base de datos ni tus imágenes: `server/data.db` y
> `server/uploads/` están en `.gitignore` y viven solo en el servidor.

---

## Notas importantes

- **Contraseña del admin:** está en `src/pages/Admin.jsx` (`ADMIN_PASSWORD`).
  Cámbiala antes de publicar y vuelve a hacer `npm run build`.
- **Datos e imágenes:** se guardan en `/var/www/zenic/server/data.db` y
  `/var/www/zenic/server/uploads/`. Haz copia de seguridad de esos dos.
- **Puerto ocupado:** si el 4000 ya lo usa otra app, arranca con otro puerto
  (`PORT=4010 pm2 start ...`) y cambia los dos `proxy_pass` en Nginx.
- **Firewall:** asegúrate de permitir HTTP/HTTPS: `sudo ufw allow 'Nginx Full'`.
- **Logs del backend:** `pm2 logs zenic-api`.
