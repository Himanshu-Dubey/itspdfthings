# Local dev setup

All three subdomains must use the **real domain** (`itspdfthings.com`) locally, not `localhost`.
This keeps cookie/SameSite behavior identical to production.

---

## 1. Windows hosts file

Open `C:\Windows\System32\drivers\etc\hosts` **as Administrator** and add:

```
127.0.0.1  api.itspdfthings.com
127.0.0.1  app.itspdfthings.com
127.0.0.1  admin.itspdfthings.com
```

---

## 2. Laragon virtual host for the API

Laragon auto-creates vhosts for folders in `C:\laragon\www\`. To use a custom domain:

1. Open Laragon → Menu → Apache → **sites-enabled** → open the config folder.
2. Create `api.itspdfthings.com.conf`:

**Apache** (`C:\laragon\etc\apache2\sites-enabled\api.itspdfthings.com.conf`):
```apache
<VirtualHost *:80>
    ServerName api.itspdfthings.com
    DocumentRoot "C:/laragon/www/loveupdf/apps/api/public"
    <Directory "C:/laragon/www/loveupdf/apps/api/public">
        AllowOverride All
        Require all granted
    </Directory>
</VirtualHost>
```

3. Restart Laragon.

> The `web` and `admin` Next.js apps run as dev servers — no Apache vhost needed for them.

---

## 3. Laravel `.env` for local dev

Copy `apps/api/.env.example` → `apps/api/.env`, then fill in:

```env
APP_KEY=        # run: php artisan key:generate
DB_HOST=127.0.0.1
DB_DATABASE=loveupdf
DB_USERNAME=root      # Laragon MySQL default
DB_PASSWORD=          # Laragon MySQL default (blank)

REDIS_HOST=127.0.0.1  # Laragon Redis is built-in
```

Run migrations and seed the first admin user:
```bash
cd apps/api
php artisan migrate
php artisan db:seed --class=AdminUserSeeder
```

This creates `admin@itspdfthings.com` / `admin1234` — change the password immediately.

---

## 4. Start Redis & MySQL (Laragon built-in)

Laragon includes Redis and MySQL. Just start Laragon and they're running.

If you prefer Docker for services only:
```bash
# From monorepo root — override file restricts this to redis + mysql only.
docker compose up -d
```

---

## 5. Start the Next.js apps

**User-facing web app (port 3000):**
```bash
cd apps/web
pnpm dev
# Access: http://app.itspdfthings.com:3000
```

**Admin dashboard (port 3001):**
```bash
cd apps/admin
pnpm dev
# Access: http://admin.itspdfthings.com:3001
```

---

## 6. Verify Phase 0 — user auth

```bash
# 1. Get CSRF cookie
curl -c cookies.txt http://api.itspdfthings.com/sanctum/csrf-cookie

# 2. Register
curl -b cookies.txt -c cookies.txt -X POST http://api.itspdfthings.com/api/auth/register \
  -H "Content-Type: application/json" \
  -H "X-XSRF-TOKEN: $(grep XSRF cookies.txt | awk '{print $7}')" \
  -d '{"name":"Test","email":"test@example.com","password":"password","password_confirmation":"password"}'

# 3. Confirm authenticated
curl -b cookies.txt http://api.itspdfthings.com/api/auth/user
```

Phase 0 user auth is complete when step 3 returns the user object (not 401).

---

## 7. Verify Phase 0 — admin auth

```bash
# 1. Get CSRF cookie
curl -c admin-cookies.txt http://api.itspdfthings.com/sanctum/csrf-cookie

# 2. Login as admin
curl -b admin-cookies.txt -c admin-cookies.txt -X POST http://api.itspdfthings.com/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -H "X-XSRF-TOKEN: $(grep XSRF admin-cookies.txt | awk '{print $7}')" \
  -d '{"email":"admin@itspdfthings.com","password":"admin1234"}'

# 3. Confirm admin session
curl -b admin-cookies.txt http://api.itspdfthings.com/api/admin/auth/user

# 4. Confirm metrics endpoint works
curl -b admin-cookies.txt http://api.itspdfthings.com/api/admin/dashboard/metrics
```

Phase 0 admin auth is complete when steps 3 and 4 return the admin object / metrics (not 401).

---

## 8. PHP + Composer in PowerShell

Laragon's PHP/Composer are not in PATH by default. Add them at the start of each session:

```powershell
$env:PATH = "C:\laragon\bin\php\php-8.3.30-Win32-vs16-x64;C:\laragon\bin\composer;" + $env:PATH
```

---

## Node.js version

Next.js 16 requires Node.js >= 20.9.0. Use [nvm-windows](https://github.com/coreybutler/nvm-windows) to manage versions:

```powershell
nvm install 22
nvm use 22
```
