#!/bin/bash

# Setup script for Headless ERPNext on MacBook M3
set -e

echo "🚀 Setting up Headless ERPNext for ARM64 architecture..."
echo ""

# Check Docker installation
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker Desktop for Mac."
    exit 1
fi

# Check Docker Compose installation
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose."
    exit 1
fi

echo "✅ Docker and Docker Compose are installed"
echo ""

# Create necessary directories
echo "📁 Creating necessary directories..."
mkdir -p nginx/conf.d

# Start services
echo "🐳 Starting ERPNext services..."
docker-compose up -d

# Wait for services to be ready
echo ""
echo "⏳ Waiting for services to initialize (this may take 5-10 minutes)..."
echo "   You can monitor progress with: docker-compose logs -f create-site"
echo ""

# Wait for site creation
max_attempts=60
attempt=0
while [ $attempt -lt $max_attempts ]; do
    if docker-compose logs create-site 2>&1 | grep -q "API setup complete\|bench new-site"; then
        echo "✅ Site creation completed!"
        break
    fi
    echo -n "."
    sleep 5
    attempt=$((attempt + 1))
done

if [ $attempt -eq $max_attempts ]; then
    echo ""
    echo "⚠️  Site creation is taking longer than expected."
    echo "Please check logs with: docker-compose logs create-site"
fi

# Configure site for API access
echo ""
echo "🔧 Configuring site for headless access..."
docker-compose exec -T backend bench --site erpnext.localhost set-config allow_cors "*" || true
docker-compose exec -T backend bench --site erpnext.localhost set-config ignore_csrf 1 || true
docker-compose exec -T backend bench --site erpnext.localhost set-config host_name "http://localhost:8080" || true

echo ""
echo "✅ Headless ERPNext setup complete!"
echo ""
echo "📝 Access Details:"
echo "   - ERPNext UI: http://localhost:8080"
echo "   - API Endpoint: http://localhost:8080/api"
echo "   - WebSocket: ws://localhost:9000"
echo "   - Default credentials: Administrator / admin"
echo ""
echo "🔑 To generate API keys, run:"
echo "   docker-compose exec backend bench --site erpnext.localhost execute frappe.core.doctype.user.user.generate_keys --args '[\"Administrator\"]'"
echo ""
echo "📚 For Next.js integration examples, check the 'nextjs-integration' folder"
echo ""
echo "⚠️  For production use:"
echo "   1. Change all default passwords"
echo "   2. Update CORS settings to your specific domain"
echo "   3. Enable CSRF protection"
echo "   4. Use HTTPS with proper certificates"
echo ""