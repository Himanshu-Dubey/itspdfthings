#!/bin/bash
set -e

echo "=========================================="
echo " PDFThings API — VPS Deployment"
echo "=========================================="

# ── Update system ──────────────────────────────────────────────────────────────
echo "[1/8] Updating system packages..."
sudo apt update && sudo apt upgrade -y

# ── Install Docker ─────────────────────────────────────────────────────────────
echo "[2/8] Installing Docker..."
if ! command -v docker &> /dev/null; then
    curl -fsSL https://get.docker.com | sudo sh
    sudo usermod -aG docker $USER
    echo "Docker installed. You may need to log out and back in for group changes."
fi

# ── Install Docker Compose ─────────────────────────────────────────────────────
echo "[3/8] Installing Docker Compose..."
if ! command -v docker compose &> /dev/null; then
    sudo apt install -y docker-compose-plugin
fi

# ── Clone or update repo ───────────────────────────────────────────────────────
echo "[4/8] Setting up project..."
DEPLOY_DIR="/opt/loveupdf"

if [ -d "$DEPLOY_DIR" ]; then
    echo "Pulling latest changes..."
    cd $DEPLOY_DIR
    git pull origin main
else
    echo "Cloning repository..."
    sudo mkdir -p $DEPLOY_DIR
    sudo chown $USER:$USER $DEPLOY_DIR
    # If using Git:
    # git clone https://github.com/YOUR_USERNAME/loveupdf.git $DEPLOY_DIR
    # cd $DEPLOY_DIR
    echo "NOTE: Copy the project files to $DEPLOY_DIR manually or set up Git."
    echo "      Then run this script again."
    exit 1
fi

# ── Generate APP_KEY if missing ────────────────────────────────────────────────
echo "[5/8] Generating Laravel APP_KEY..."
cd apps/api
if ! grep -q "APP_KEY=base64:" .env 2>/dev/null || grep -q "APP_KEY=$" .env; then
    php artisan key:generate --force
fi
cd ../..

# ── Build and start containers ─────────────────────────────────────────────────
echo "[6/8] Building and starting containers..."
docker compose -f docker-compose.prod.yml up -d --build

# ── Run migrations ─────────────────────────────────────────────────────────────
echo "[7/8] Running database migrations..."
docker compose -f docker-compose.prod.yml exec app php artisan migrate --force

# ── Seed admin user if needed ─────────────────────────────────────────────────
echo "[8/8] Seeding admin user..."
docker compose -f docker-compose.prod.yml exec app php artisan db:seed --class=AdminUserSeeder --force 2>/dev/null || true

echo ""
echo "=========================================="
echo " Deployment complete!"
echo "=========================================="
echo ""
echo " API: https://api.itspdfthings.com"
echo ""
echo " Next steps:"
echo " 1. Point api.itspdfthings.com DNS → $(curl -s ifconfig.me)"
echo " 2. Wait 2-3 min for SSL certificate"
echo " 3. Test: curl https://api.itspdfthings.com/sanctum/csrf-cookie"
echo ""
