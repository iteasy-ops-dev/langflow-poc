# 빠른 시작 가이드

## 1단계: 시스템 시작

```bash
docker compose up -d
```

## 2단계: Langflow 접속 및 플로우 생성

1. 브라우저에서 http://localhost:7860 접속
2. Langflow 초기 설정 완료

### 챗봇 플로우 생성 (chatbot-flow)

1. New Flow 클릭
2. 다음 컴포넌트 추가:
   - Chat Input
   - OpenAI (또는 선호하는 LLM)
   - Prompt Template:
     ```
     당신은 ITEASY의 고객 지원 AI입니다.
     다음 정보를 바탕으로 답변하세요:
     - 서버 호스팅, 클라우드 서비스 제공
     - 24/7 기술 지원
     - 합리적인 가격과 안정적인 인프라
     
     사용자 질문: {input}
     ```
   - Chat Output
3. 컴포넌트 연결 후 Save
4. Flow ID 확인 (URL에서 확인 가능)

### 문서 요약 플로우 생성 (document-summary-flow)

1. New Flow 클릭
2. 다음 컴포넌트 추가:
   - Text Input
   - OpenAI (또는 선호하는 LLM)
   - Prompt Template:
     ```
     다음 문서를 3-5개의 핵심 포인트로 요약하세요:
     
     {input}
     
     요약:
     ```
   - Text Output
3. 컴포넌트 연결 후 Save
4. Flow ID 확인

### 로그 분석 플로우 생성 (log-analysis-flow)

1. New Flow 클릭
2. 다음 컴포넌트 추가:
   - Text Input
   - OpenAI (또는 선호하는 LLM)
   - Prompt Template:
     ```
     다음 서버 로그를 분석하고:
     1. 심각도 수준 (Critical/Warning/Info/Normal)
     2. 발견된 이슈들
     3. 권장 조치사항
     을 제시하세요.
     
     로그:
     {input}
     
     분석 결과:
     ```
   - Text Output
3. 컴포넌트 연결 후 Save
4. Flow ID 확인

## 3단계: Flow ID 업데이트

각 플로우의 ID를 확인한 후, 프론트엔드 코드에 반영:

### frontend/app/chatbot/page.tsx
```typescript
const response = await callLangflowAPI('YOUR_CHATBOT_FLOW_ID', input)
```

### frontend/app/summarize/page.tsx
```typescript
const response = await callLangflowAPI('YOUR_SUMMARY_FLOW_ID', documentText)
```

### frontend/app/log-analysis/page.tsx
```typescript
const response = await callLangflowAPI('YOUR_LOG_ANALYSIS_FLOW_ID', logText)
```

## 4단계: 프론트엔드 재시작

```bash
docker compose restart frontend
```

## 5단계: 접속 테스트

http://localhost:3000 접속하여 각 기능 테스트

## 환경 변수 (선택사항)

필요시 `.env` 파일 생성:

```env
LANGFLOW_API_URL=http://langflow:7860
OPENAI_API_KEY=your_api_key_here
```

## 문제 해결

### Langflow가 시작되지 않음
```bash
docker compose logs langflow
docker compose restart langflow
```

### 프론트엔드가 Langflow에 연결 안 됨
- Docker 네트워크 확인
- Langflow가 완전히 시작될 때까지 1-2분 대기

### 포트 충돌
docker compose.yml에서 포트 변경:
```yaml
ports:
  - "3001:3000"  # 3000 대신 3001 사용
```

## 개발 모드로 실행

```bash
cd frontend
npm install
npm run dev
```

이 경우 .env.local 파일 필요:
```
LANGFLOW_API_URL=http://localhost:7860
```
