# ITEASY AI 자동화 플랫폼

Langflow 기반 업무 자동화 프론트엔드 POC 프로젝트입니다.

## 🎯 프로젝트 개요

비개발자도 쉽게 사용할 수 있는 Langflow 프론트엔드를 제공하여, 복잡한 AI 플로우를 간단한 UI로 접근할 수 있게 합니다.

### 주요 유스케이스

1. **💬 AI 고객 지원 챗봇**: ITEASY 서비스 관련 문의에 24/7 즉각 응답
2. **📝 기술 문서 요약**: 복잡한 기술 문서를 핵심만 간추려 제공
3. **🔍 서버 로그 분석**: 로그 패턴을 분석하여 이상 징후 탐지

## 🏗️ 아키텍처

```
┌─────────────────────────────────────────────────┐
│  Docker Compose (Single Instance)              │
│                                                 │
│  ┌──────────────┐  ┌──────────────┐           │
│  │  Next.js     │  │  Langflow    │           │
│  │  :3000       │→│  :7860       │           │
│  └──────────────┘  └──────┬───────┘           │
│                            ↓                    │
│  ┌──────────────┐  ┌──────────────┐           │
│  │  PostgreSQL  │←│  PgAdmin     │           │
│  │  :5432       │  │  :5050       │           │
│  └──────────────┘  └──────────────┘           │
│                                                 │
│  ┌──────────────┐  ┌──────────────┐           │
│  │  cAdvisor    │→│  Prometheus  │           │
│  │  :8080       │  │  :9090       │           │
│  └──────────────┘  └──────┬───────┘           │
│                            ↓                    │
│                    ┌──────────────┐            │
│                    │  Grafana     │            │
│                    │  :3001       │            │
│                    └──────────────┘            │
└─────────────────────────────────────────────────┘
```

## 🛠️ 기술 스택

- **프론트엔드**: Next.js 14 (App Router), React 19, TailwindCSS
- **백엔드**: Langflow (Docker)
- **데이터베이스**: PostgreSQL + PgAdmin
- **모니터링**: Prometheus + Grafana + cAdvisor
- **인프라**: Docker Compose

## 📦 설치 및 실행

### 사전 요구사항

- Docker & Docker Compose
- Node.js 20+ (로컬 개발 시)

### 1. 프로젝트 클론

```bash
git clone <repository-url>
cd extendLangFlow
```

### 2. 환경 변수 설정

```bash
cp .env.example .env
# .env 파일을 열어 비밀번호 수정
```

### 3. Docker Compose로 실행

```bash
docker-compose up -d
```

### 4. 서비스 접속

| 서비스 | URL | 계정 정보 |
|--------|-----|-----------|
| **프론트엔드** | http://localhost:3000 | - |
| **Langflow** | http://localhost:7860 | `.env` 파일 참조 |
| **PgAdmin** | http://localhost:5050 | `.env` 파일 참조 |
| **Grafana** | http://localhost:3001 | `.env` 파일 참조 |
| **Prometheus** | http://localhost:9090 | - |
| **cAdvisor** | http://localhost:8080 | - |

### 3. Langflow 플로우 설정

1. http://localhost:7860 접속
2. 각 유스케이스별 플로우 생성:
   - `chatbot-flow`: 고객 지원 챗봇
   - `document-summary-flow`: 문서 요약
   - `log-analysis-flow`: 로그 분석

3. 각 플로우의 ID를 확인하여 프론트엔드 코드에 반영

### 4. 로컬 개발 (선택사항)

```bash
cd frontend
npm install
npm run dev
```

## 📁 프로젝트 구조

```
extendLangFlow/
├── docker-compose.yml       # Docker Compose 설정
├── frontend/                # Next.js 프론트엔드
│   ├── app/
│   │   ├── page.tsx        # 대시보드
│   │   ├── chatbot/        # 챗봇 UI
│   │   ├── summarize/      # 문서 요약 UI
│   │   ├── log-analysis/   # 로그 분석 UI
│   │   └── api/
│   │       └── langflow/   # Langflow API 프록시
│   ├── components/
│   ├── lib/
│   │   └── langflow.ts     # Langflow API 클라이언트
│   └── Dockerfile
├── data/                    # 데이터 볼륨
└── README.md
```

## 🔧 환경 변수

### Docker Compose (자동 설정됨)

- `LANGFLOW_API_URL`: Langflow API 엔드포인트
- `NODE_ENV`: 환경 (development/production)

## 📝 Langflow 플로우 가이드

### 1. 챗봇 플로우 예시

```
Chat Input → RAG (ITEASY 문서) → LLM → Chat Output
```

### 2. 문서 요약 플로우 예시

```
Text Input → Summarization Prompt → LLM → Text Output
```

### 3. 로그 분석 플로우 예시

```
Text Input → Log Analysis Prompt → LLM → Structured Output
```

## 🚀 배포

POC 수준이므로 단일 인스턴스 배포를 권장합니다.

```bash
docker-compose up -d --build
```

## 🎨 커스터마이징

### 새로운 유스케이스 추가

1. Langflow에서 새 플로우 생성
2. `frontend/app/` 아래 새 페이지 생성
3. `frontend/app/page.tsx`에 카드 추가
4. `lib/langflow.ts`에서 API 호출 구현

## 📊 데모 시나리오

### 시나리오 1: 고객 문의 응대
1. 대시보드에서 "AI 고객 지원 챗봇" 선택
2. "서버 호스팅 요금제가 궁금합니다" 입력
3. AI가 ITEASY 문서 기반으로 응답

### 시나리오 2: 기술 문서 요약
1. "기술 문서 요약" 선택
2. 긴 기술 문서 텍스트 붙여넣기
3. 핵심 요약본 확인

### 시나리오 3: 로그 이상 탐지
1. "서버 로그 분석" 선택
2. 샘플 로그 사용 또는 실제 로그 입력
3. AI가 이상 패턴 및 권장사항 제시

## 📊 모니터링

모니터링 시스템 사용법은 [MONITORING.md](./MONITORING.md)를 참조하세요.

**빠른 시작:**
1. Grafana 접속 (http://localhost:3001)
2. Prometheus 데이터 소스 추가 (`http://prometheus:9090`)
3. 대시보드 Import (ID: 193)

## 🐛 트러블슈팅

### Langflow API 연결 실패
```bash
docker-compose logs langflow
```
Langflow 컨테이너가 정상 작동 중인지 확인

### 프론트엔드 빌드 오류
```bash
cd frontend
npm install
npm run build
```

### 모니터링 데이터가 안 보일 때
```bash
# Prometheus Targets 확인
http://localhost:9090/targets
# 모두 UP 상태여야 함
```

## 📄 라이선스

POC 프로젝트 - 내부 사용 전용

## 👥 컨트리뷰터

- 개발자: [Your Name]
- 컨퍼런스: [Conference Name]
- 날짜: 2025-10-14
