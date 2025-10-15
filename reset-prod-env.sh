#!/bin/bash

set -e

echo "╔══════════════════════════════════════════════════════════════╗"
echo "║     프로덕션 환경 변수 재설정 및 컨테이너 재시작            ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""

# .env.prod 파일 존재 확인
if [ ! -f .env.prod ]; then
    echo "❌ .env.prod 파일이 없습니다!"
    exit 1
fi

# 기본 비밀번호 체크
if grep -q "CHANGE_THIS_" .env.prod; then
    echo "⚠️  경고: .env.prod 파일에 기본 비밀번호가 있습니다."
    echo ""
    read -p "비밀번호를 변경하셨습니까? (y/n): " -n 1 -r
    echo ""
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo ""
        echo "❌ .env.prod 파일을 먼저 수정해주세요:"
        echo "   nano .env.prod"
        exit 1
    fi
fi

echo "📋 환경 변수 확인 중..."
source .env.prod

echo ""
echo "현재 설정:"
echo "  - PostgreSQL User: $POSTGRES_USER"
echo "  - Langflow User: $LANGFLOW_SUPERUSER"
echo "  - Grafana User: $GRAFANA_USER"
echo ""

read -p "이 설정으로 계속하시겠습니까? (y/n): " -n 1 -r
echo ""
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "취소되었습니다."
    exit 0
fi

echo ""
echo "🛑 기존 컨테이너 중지 및 삭제..."
docker compose -f docker-compose.prod.yml --env-file .env.prod down -v

echo ""
echo "🚀 새 설정으로 컨테이너 시작..."
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d

echo ""
echo "⏳ 서비스 시작 대기 중..."
sleep 15

echo ""
echo "🔍 서비스 상태 확인..."
docker compose -f docker-compose.prod.yml --env-file .env.prod ps

echo ""
echo "╔══════════════════════════════════════════════════════════════╗"
echo "║                   ✅ 재시작 완료                             ║"
echo "╚══════════════════════════════════════════════════════════════╝"
echo ""
echo "📝 접속 정보:"
echo "  - Langflow: http://localhost:7860"
echo "    계정: $LANGFLOW_SUPERUSER / [설정한 비밀번호]"
echo ""
echo "  - Grafana: http://localhost:3001"
echo "    계정: $GRAFANA_USER / [설정한 비밀번호]"
echo ""
echo "  - Frontend: http://localhost:3000"
echo ""
echo "🧪 테스트:"
echo "  curl http://localhost:3000"
echo "  curl http://localhost:7860/health"
echo ""
