.PHONY: help dev prod build up down restart logs ps clean test health deploy

# Default target
help:
	@echo "╔══════════════════════════════════════════════════════════════╗"
	@echo "║       ITEASY AI Platform - Makefile Commands                ║"
	@echo "╚══════════════════════════════════════════════════════════════╝"
	@echo ""
	@echo "Development Commands:"
	@echo "  make dev              - Start development environment"
	@echo "  make dev-build        - Build and start development environment"
	@echo "  make dev-down         - Stop development environment"
	@echo "  make dev-logs         - Show development logs"
	@echo ""
	@echo "Production Commands:"
	@echo "  make prod             - Start production environment"
	@echo "  make prod-build       - Build and start production environment"
	@echo "  make prod-down        - Stop production environment"
	@echo "  make prod-logs        - Show production logs"
	@echo "  make deploy           - Deploy production (with deploy.sh)"
	@echo ""
	@echo "Common Commands:"
	@echo "  make ps               - List running containers"
	@echo "  make restart          - Restart all services"
	@echo "  make health           - Check service health"
	@echo "  make clean            - Remove all containers and volumes"
	@echo "  make reset-prod       - Reset production with new env vars"
	@echo ""
	@echo "Monitoring Commands:"
	@echo "  make monitoring       - Open Grafana dashboard"
	@echo "  make prometheus       - Open Prometheus UI"
	@echo "  make metrics          - Show container metrics"
	@echo ""

# Development Environment
dev:
	docker compose up -d

dev-build:
	docker compose up -d --build

dev-down:
	docker compose down

dev-logs:
	docker compose logs -f

# Production Environment
prod:
	docker compose -f docker-compose.prod.yml --env-file .env.prod up -d

prod-build:
	docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build

prod-down:
	docker compose -f docker-compose.prod.yml --env-file .env.prod down

prod-logs:
	docker compose -f docker-compose.prod.yml --env-file .env.prod logs -f

# Deploy
deploy:
	@echo "🚀 Running production deployment..."
	./deploy.sh

reset-prod:
	@echo "🔄 Resetting production environment..."
	./reset-prod-env.sh

# Common Commands
ps:
	docker compose ps
	@echo ""
	@echo "Production containers:"
	docker compose -f docker-compose.prod.yml ps

restart:
	docker compose restart

restart-service:
	@read -p "Enter service name: " service; \
	docker compose restart $$service

logs:
	docker compose logs -f

logs-service:
	@read -p "Enter service name: " service; \
	docker compose logs -f $$service

# Health Check
health:
	@echo "╔══════════════════════════════════════════════════════════════╗"
	@echo "║              Service Health Check                            ║"
	@echo "╚══════════════════════════════════════════════════════════════╝"
	@echo ""
	@echo "Frontend:    " && curl -s -o /dev/null -w "%{http_code}" http://localhost:3000 || echo "Down"
	@echo "Langflow:    " && curl -s -o /dev/null -w "%{http_code}" http://localhost:7860/health || echo "Down"
	@echo "Grafana:     " && curl -s -o /dev/null -w "%{http_code}" http://localhost:3001 || echo "Down"
	@echo "Prometheus:  " && curl -s -o /dev/null -w "%{http_code}" http://localhost:9090 || echo "Down"
	@echo ""

# Monitoring
monitoring:
	@echo "📊 Opening Grafana dashboard..."
	open http://localhost:3001 || xdg-open http://localhost:3001 || echo "Open http://localhost:3001"

prometheus:
	@echo "📈 Opening Prometheus UI..."
	open http://localhost:9090 || xdg-open http://localhost:9090 || echo "Open http://localhost:9090"

metrics:
	@echo "📊 Container Metrics:"
	@docker stats --no-stream --format "table {{.Name}}\t{{.CPUPerc}}\t{{.MemUsage}}\t{{.NetIO}}"

# Clean
clean:
	@echo "⚠️  Warning: This will remove all containers and volumes!"
	@read -p "Are you sure? (y/n): " confirm; \
	if [ "$$confirm" = "y" ]; then \
		docker compose down -v; \
		docker compose -f docker-compose.prod.yml down -v; \
		echo "✅ Cleaned up!"; \
	else \
		echo "❌ Cancelled"; \
	fi

clean-force:
	docker compose down -v
	docker compose -f docker-compose.prod.yml --env-file .env.prod down -v
	@echo "✅ All containers and volumes removed!"

# Build specific service
build-frontend:
	docker compose build frontend

build-frontend-prod:
	docker compose -f docker-compose.prod.yml --env-file .env.prod build frontend

# Database
db-backup:
	@echo "💾 Backing up PostgreSQL database..."
	docker exec extendlangflow-postgres-1 pg_dump -U langflow langflow > backup-$$(date +%Y%m%d-%H%M%S).sql
	@echo "✅ Backup completed!"

db-restore:
	@read -p "Enter backup file path: " backup; \
	docker exec -i extendlangflow-postgres-1 psql -U langflow langflow < $$backup

db-shell:
	docker exec -it extendlangflow-postgres-1 psql -U langflow -d langflow

# Frontend
frontend-shell:
	docker exec -it extendlangflow-frontend-1 sh

frontend-build-local:
	cd frontend && npm run build

# Git
git-status:
	git status

git-push:
	git push origin main

# Test
test-build:
	@echo "🧪 Testing production build..."
	docker compose -f docker-compose.prod.yml --env-file .env.prod build frontend

test-health:
	@echo "🧪 Testing health endpoints..."
	@echo "Frontend:"; curl -s http://localhost:3000 > /dev/null && echo "  ✅ OK" || echo "  ❌ Failed"
	@echo "Langflow:"; curl -s http://localhost:7860/health > /dev/null && echo "  ✅ OK" || echo "  ❌ Failed"
	@echo "Grafana:"; curl -s http://localhost:3001/api/health > /dev/null && echo "  ✅ OK" || echo "  ❌ Failed"
	@echo "Prometheus:"; curl -s http://localhost:9090/-/healthy > /dev/null && echo "  ✅ OK" || echo "  ❌ Failed"

# Diagnostics
diagnose:
	@echo "🔍 Running server diagnostics..."
	./diagnose.sh

diagnose-nginx:
	@echo "📋 Nginx Configuration:"
	docker exec iteasy-nginx cat /etc/nginx/conf.d/default.conf

diagnose-logs:
	@echo "📊 Service Logs:"
	@echo ""
	@echo "=== Nginx ==="
	docker logs --tail 20 iteasy-nginx 2>&1 || echo "Nginx not running"
	@echo ""
	@echo "=== Langflow ==="
	docker logs --tail 20 iteasy-langflow 2>&1 || echo "Langflow not running"
	@echo ""
	@echo "=== Frontend ==="
	docker logs --tail 20 iteasy-frontend 2>&1 || echo "Frontend not running"
