#!/bin/bash

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║       ITEASY AI Platform - 서버 진단 스크립트               ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📦 1. 실행 중인 컨테이너"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}" | grep -E "NAME|iteasy"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔍 2. 주요 서비스 확인"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Nginx 확인
if docker ps | grep -q "iteasy-nginx"; then
    echo "✅ Nginx: Running"
    NGINX_CONTAINER=$(docker ps | grep "iteasy-nginx" | awk '{print $1}')
else
    echo "❌ Nginx: Not Running"
    NGINX_CONTAINER=""
fi

# Langflow 확인
if docker ps | grep -q "langflow"; then
    echo "✅ Langflow: Running"
    LANGFLOW_CONTAINER=$(docker ps | grep "langflow" | awk '{print $1}')
else
    echo "❌ Langflow: Not Running"
    LANGFLOW_CONTAINER=""
fi

# Frontend 확인
if docker ps | grep -q "frontend"; then
    echo "✅ Frontend: Running"
    FRONTEND_CONTAINER=$(docker ps | grep "frontend" | awk '{print $1}')
else
    echo "❌ Frontend: Not Running"
    FRONTEND_CONTAINER=""
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🌐 3. 네트워크 확인"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
docker network ls | grep iteasy

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🔌 4. 포트 확인"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "포트 80 (Nginx):"
netstat -tuln | grep ":80 " || ss -tuln | grep ":80 " || echo "  확인 불가"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧪 5. 내부 연결 테스트"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

if [ -n "$NGINX_CONTAINER" ]; then
    echo "Nginx → Langflow 연결 테스트:"
    docker exec $NGINX_CONTAINER wget -q -O - http://langflow:7860/health 2>/dev/null && echo "  ✅ OK" || echo "  ❌ Failed"
    
    echo "Nginx → Frontend 연결 테스트:"
    docker exec $NGINX_CONTAINER wget -q -O - http://frontend:3000 2>/dev/null | head -1 && echo "  ✅ OK" || echo "  ❌ Failed"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 6. Nginx 설정 확인"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ -n "$NGINX_CONTAINER" ]; then
    echo "Nginx 설정 파일 존재 확인:"
    docker exec $NGINX_CONTAINER ls -la /etc/nginx/conf.d/
    
    echo ""
    echo "Nginx upstream 설정:"
    docker exec $NGINX_CONTAINER cat /etc/nginx/conf.d/default.conf | grep -A 2 "upstream"
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 7. 최근 Nginx 로그 (마지막 10줄)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ -n "$NGINX_CONTAINER" ]; then
    docker logs --tail 10 $NGINX_CONTAINER 2>&1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📊 8. Langflow 로그 (마지막 10줄)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ -n "$LANGFLOW_CONTAINER" ]; then
    docker logs --tail 10 $LANGFLOW_CONTAINER 2>&1
fi

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "🧪 9. 외부 접속 테스트"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "Health 엔드포인트:"
curl -s http://localhost/health && echo "" || echo "Failed"

echo "Langflow 경로:"
curl -I http://localhost/langflow/ 2>&1 | grep "HTTP"

echo "Frontend 경로:"
curl -I http://localhost/ 2>&1 | grep "HTTP"

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "💡 권장 조치"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ -z "$NGINX_CONTAINER" ]; then
    echo "❌ Nginx가 실행되지 않았습니다:"
    echo "   docker compose -f docker-compose.prod.yml --env-file .env.prod up -d nginx"
    echo ""
fi

if [ -z "$LANGFLOW_CONTAINER" ]; then
    echo "❌ Langflow가 실행되지 않았습니다:"
    echo "   docker compose -f docker-compose.prod.yml --env-file .env.prod up -d langflow"
    echo ""
fi

if [ -n "$NGINX_CONTAINER" ] && [ -n "$LANGFLOW_CONTAINER" ]; then
    echo "✅ 모든 주요 서비스가 실행 중입니다."
    echo "   문제가 지속되면 컨테이너를 재시작하세요:"
    echo "   docker compose -f docker-compose.prod.yml --env-file .env.prod restart"
    echo ""
fi

echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "진단 완료"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
