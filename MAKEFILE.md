# 📦 Makefile 사용 가이드

## 🎯 개요

Makefile을 사용하면 복잡한 Docker Compose 명령어를 간단하게 실행할 수 있습니다.

**기존 방식:**
```bash
docker compose -f docker-compose.prod.yml --env-file .env.prod up -d --build
```

**Makefile 사용:**
```bash
make prod-build
```

---

## 📋 전체 명령어 목록

### 도움말
```bash
make help
```

---

## 🔧 개발 환경 (Development)

### 시작
```bash
make dev                 # 개발 환경 시작
make dev-build           # 빌드 후 시작
```

### 중지
```bash
make dev-down            # 개발 환경 중지
```

### 로그 확인
```bash
make dev-logs            # 개발 환경 로그
```

---

## 🚀 프로덕션 환경 (Production)

### 시작
```bash
make prod                # 프로덕션 환경 시작
make prod-build          # 빌드 후 시작
```

### 배포
```bash
make deploy              # deploy.sh 스크립트 실행
make reset-prod          # 환경 변수 재설정
```

### 중지
```bash
make prod-down           # 프로덕션 환경 중지
```

### 로그 확인
```bash
make prod-logs           # 프로덕션 로그
```

---

## 📊 모니터링

### 대시보드 열기
```bash
make monitoring          # Grafana 대시보드 열기
make prometheus          # Prometheus UI 열기
```

### 메트릭 확인
```bash
make metrics             # 컨테이너 리소스 사용량
make health              # 서비스 헬스 체크
```

---

## 🔍 일반 명령어

### 컨테이너 관리
```bash
make ps                  # 실행 중인 컨테이너 목록
make restart             # 모든 서비스 재시작
make logs                # 전체 로그 확인
```

### 특정 서비스 관리
```bash
make restart-service     # 특정 서비스 재시작 (입력 받음)
make logs-service        # 특정 서비스 로그 (입력 받음)
```

---

## 🗄️ 데이터베이스

### 백업
```bash
make db-backup           # PostgreSQL 백업
```

### 복원
```bash
make db-restore          # 백업 파일에서 복원
```

### 접속
```bash
make db-shell            # PostgreSQL 쉘 접속
```

---

## 🏗️ 빌드

### Frontend 빌드
```bash
make build-frontend           # 개발 환경 빌드
make build-frontend-prod      # 프로덕션 빌드
make frontend-build-local     # 로컬에서 npm build
```

### 빌드 테스트
```bash
make test-build          # 프로덕션 빌드 테스트
```

---

## 🧹 정리

### 안전한 정리 (확인 후 삭제)
```bash
make clean               # 모든 컨테이너와 볼륨 삭제 (확인)
```

### 강제 정리
```bash
make clean-force         # 확인 없이 즉시 삭제
```

---

## 📱 프론트엔드

### 쉘 접속
```bash
make frontend-shell      # Frontend 컨테이너 쉘
```

---

## 🔐 Git

### Git 명령어
```bash
make git-status          # git status
make git-push            # git push origin main
```

---

## 🧪 테스트

### 헬스 체크
```bash
make test-health         # 모든 서비스 헬스 테스트
```

---

## 💡 실전 예제

### 1. 처음 시작하기
```bash
# 개발 환경
make dev

# 또는 프로덕션 환경
make prod
```

### 2. 프로덕션 배포
```bash
# 서버에서
make deploy
```

### 3. 모니터링 확인
```bash
# Grafana 대시보드 열기
make monitoring

# 메트릭 확인
make metrics

# 헬스 체크
make health
```

### 4. 로그 확인
```bash
# 전체 로그
make logs

# 특정 서비스 (예: langflow)
make logs-service
# 입력: langflow
```

### 5. 서비스 재시작
```bash
# 전체 재시작
make restart

# 특정 서비스만 (예: frontend)
make restart-service
# 입력: frontend
```

### 6. 데이터베이스 백업
```bash
# 백업
make db-backup

# 백업 파일 확인
ls -lh backup-*.sql

# 복원
make db-restore
# 입력: backup-20251015-120000.sql
```

### 7. 환경 재설정
```bash
# .env.prod 수정 후
make reset-prod
```

### 8. 정리
```bash
# 모든 컨테이너와 볼륨 삭제
make clean
# 확인 메시지: y 입력
```

---

## 🔄 기존 명령어 → Makefile 비교

| 기존 명령어 | Makefile | 설명 |
|------------|----------|------|
| `docker compose up -d` | `make dev` | 개발 환경 시작 |
| `docker compose -f docker-compose.prod.yml --env-file .env.prod up -d` | `make prod` | 프로덕션 시작 |
| `docker compose logs -f` | `make logs` | 로그 확인 |
| `docker compose ps` | `make ps` | 컨테이너 목록 |
| `docker compose restart` | `make restart` | 재시작 |
| `docker compose down -v` | `make clean` | 정리 |
| `docker stats` | `make metrics` | 메트릭 확인 |

---

## ⚙️ Makefile 커스터마이징

자주 사용하는 명령어를 추가하려면 `Makefile`을 수정하세요:

```makefile
# 예: Langflow 재시작 단축키
restart-langflow:
	docker compose restart langflow

# 예: Frontend 로그만 보기
logs-frontend:
	docker compose logs -f frontend
```

사용:
```bash
make restart-langflow
make logs-frontend
```

---

## 🎯 권장 워크플로우

### 개발 시
```bash
make dev              # 시작
make logs             # 로그 확인
make restart          # 변경사항 적용
make dev-down         # 종료
```

### 프로덕션 배포 시
```bash
make prod-build       # 빌드 및 시작
make health           # 헬스 체크
make monitoring       # 모니터링 확인
make logs             # 로그 확인
```

### 문제 해결 시
```bash
make ps               # 컨테이너 상태 확인
make health           # 헬스 체크
make logs-service     # 특정 서비스 로그
make restart-service  # 특정 서비스 재시작
```

---

## 📝 참고 사항

1. **Tab vs Spaces**: Makefile은 탭(Tab)을 사용해야 합니다.
2. **대화형 명령어**: `restart-service`, `logs-service` 등은 서비스명 입력 필요
3. **플랫폼**: macOS, Linux, WSL에서 작동 (Windows CMD는 별도 설정 필요)

---

**작성일**: 2025-10-15  
**버전**: 1.0.0
