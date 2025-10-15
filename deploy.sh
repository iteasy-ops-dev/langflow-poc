#!/bin/bash

set -e

echo "========================================="
echo "ITEASY AI Platform - Production Deployment"
echo "========================================="
echo ""

if [ ! -f .env.prod ]; then
    echo "❌ Error: .env.prod file not found!"
    echo "Please copy .env.prod.example and configure it:"
    echo "  cp .env.prod .env.prod.example"
    echo "  nano .env.prod"
    exit 1
fi

echo "📋 Checking environment variables..."
source .env.prod

if [ "$POSTGRES_PASSWORD" == "CHANGE_THIS_STRONG_PASSWORD_123!@#" ]; then
    echo "❌ Error: Please change default passwords in .env.prod"
    exit 1
fi

echo "✅ Environment variables loaded"
echo ""

echo "🐳 Pulling latest Docker images..."
docker-compose -f docker-compose.prod.yml pull

echo ""
echo "🔨 Building frontend image..."
docker-compose -f docker-compose.prod.yml build frontend

echo ""
echo "🔒 Creating Nginx password file..."
if [ ! -f nginx/.htpasswd ]; then
    docker run --rm httpd:alpine htpasswd -nb $NGINX_USER $NGINX_PASSWORD > nginx/.htpasswd
    echo "✅ Nginx password file created"
else
    echo "⚠️  Nginx password file already exists, skipping..."
fi

echo ""
echo "🚀 Starting services..."
docker-compose -f docker-compose.prod.yml up -d

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

echo ""
echo "🔍 Checking service status..."
docker-compose -f docker-compose.prod.yml ps

echo ""
echo "========================================="
echo "✅ Deployment Complete!"
echo "========================================="
echo ""
echo "📊 Access URLs:"
echo ""
echo "  Frontend:    http://$SERVER_IP"
echo "  Langflow:    http://$SERVER_IP/langflow"
echo "  Grafana:     http://$SERVER_IP/grafana"
echo "  Prometheus:  http://$SERVER_IP/prometheus (password protected)"
echo "  Health:      http://$SERVER_IP/health"
echo ""
echo "🔐 Credentials:"
echo "  Langflow: $LANGFLOW_SUPERUSER / [check .env.prod]"
echo "  Grafana:  $GRAFANA_USER / [check .env.prod]"
echo ""
echo "📝 Next steps:"
echo "  1. Test the health endpoint: curl http://$SERVER_IP/health"
echo "  2. Access Grafana and verify dashboards"
echo "  3. Configure Langflow flows"
echo "  4. Update DNS/firewall rules if needed"
echo ""
echo "📚 Logs: docker-compose -f docker-compose.prod.yml logs -f [service-name]"
echo "🔄 Restart: docker-compose -f docker-compose.prod.yml restart [service-name]"
echo "🛑 Stop: docker-compose -f docker-compose.prod.yml down"
echo ""
