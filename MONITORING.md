# 모니터링 시스템 사용 가이드

## 📊 시스템 구성

```
cAdvisor (컨테이너 메트릭 수집)
    ↓
Prometheus (메트릭 저장 및 쿼리)
    ↓
Grafana (시각화 대시보드)
```

---

## 1. cAdvisor (Container Advisor)

### 접속
- URL: http://localhost:8080

### 기능
컨테이너별 실시간 리소스 사용량을 수집하고 표시합니다.

### 사용 방법

1. **메인 대시보드**
   - 접속하면 모든 컨테이너 목록이 표시됩니다
   - CPU, 메모리, 네트워크, 디스크 사용량을 실시간으로 확인

2. **개별 컨테이너 모니터링**
   - 컨테이너 이름 클릭 (예: `extendlangflow-langflow-1`)
   - 상세 메트릭 확인:
     - CPU 사용률 (%)
     - 메모리 사용량 (MB)
     - 네트워크 I/O (bytes)
     - 파일시스템 I/O

3. **주요 확인 사항**
   - Langflow 컨테이너 메모리 사용량
   - PostgreSQL CPU 사용률
   - Frontend 네트워크 트래픽

---

## 2. Prometheus (메트릭 저장소)

### 접속
- URL: http://localhost:9090

### 기능
- cAdvisor에서 수집한 메트릭을 15초마다 저장
- PromQL로 메트릭 쿼리 가능
- Grafana의 데이터 소스 역할

### 사용 방법

#### 2-1. 타겟 확인
1. 상단 메뉴: **Status → Targets**
2. 모든 서비스가 `UP` 상태인지 확인:
   - `cadvisor` (8080)
   - `postgres` (5432)
   - `langflow` (7860)
   - `frontend` (3000)

#### 2-2. 메트릭 쿼리 (Graph)
1. 상단 메뉴: **Graph** 클릭
2. **Expression** 입력창에 PromQL 쿼리 작성

**유용한 쿼리 예시:**

```promql
# 1. 컨테이너별 CPU 사용률 (%)
rate(container_cpu_usage_seconds_total{name=~"extendlangflow.*"}[5m]) * 100

# 2. 컨테이너별 메모리 사용량 (MB)
container_memory_usage_bytes{name=~"extendlangflow.*"} / 1024 / 1024

# 3. Langflow 컨테이너 메모리
container_memory_usage_bytes{name="extendlangflow-langflow-1"} / 1024 / 1024

# 4. PostgreSQL CPU 사용률
rate(container_cpu_usage_seconds_total{name="extendlangflow-postgres-1"}[5m]) * 100

# 5. 네트워크 수신 바이트 (Frontend)
rate(container_network_receive_bytes_total{name="extendlangflow-frontend-1"}[5m])

# 6. 전체 컨테이너 개수
count(container_last_seen)
```

3. **Execute** 버튼 클릭
4. **Graph** 탭에서 시각화 확인

#### 2-3. Alerts 설정 (선택사항)
메모리나 CPU가 특정 임계값을 넘으면 알림 설정 가능 (고급 기능)

---

## 3. Grafana (시각화 대시보드)

### 접속
- URL: http://localhost:3001
- 아이디: `admin`
- 비밀번호: `admin`

### 초기 설정

#### Step 1: Prometheus 데이터 소스 추가

1. 로그인 후 좌측 메뉴: **⚙️ Configuration → Data sources**
2. **Add data source** 클릭
3. **Prometheus** 선택
4. 설정 입력:
   ```
   Name: Prometheus
   URL: http://prometheus:9090
   ```
5. **Save & Test** 클릭 (✅ Data source is working 확인)

#### Step 2: 대시보드 생성

##### 방법 A: 기본 템플릿 사용 (추천)

1. 좌측 메뉴: **➕ Create → Import**
2. **Import via grafana.com** 입력창에 대시보드 ID 입력:
   - **193** (Docker Container & Host Metrics)
   - **11600** (Docker Monitoring)
3. **Load** 클릭
4. Prometheus 데이터 소스 선택
5. **Import** 클릭

##### 방법 B: 직접 대시보드 생성

1. 좌측 메뉴: **➕ Create → Dashboard**
2. **Add a new panel** 클릭
3. **Query** 탭에서 메트릭 선택:

**패널 1: Langflow CPU 사용률**
```promql
rate(container_cpu_usage_seconds_total{name="extendlangflow-langflow-1"}[5m]) * 100
```
- Visualization: Time series
- Panel title: "Langflow CPU Usage (%)"

**패널 2: 전체 메모리 사용량**
```promql
sum(container_memory_usage_bytes{name=~"extendlangflow.*"}) / 1024 / 1024 / 1024
```
- Visualization: Gauge
- Panel title: "Total Memory Usage (GB)"
- Unit: gigabytes

**패널 3: 컨테이너별 메모리 (파이 차트)**
```promql
container_memory_usage_bytes{name=~"extendlangflow.*"}
```
- Visualization: Pie chart
- Panel title: "Memory by Container"
- Legend: {{name}}

**패널 4: 네트워크 트래픽**
```promql
rate(container_network_receive_bytes_total{name="extendlangflow-frontend-1"}[5m])
```
- Visualization: Time series
- Panel title: "Frontend Network Traffic"

4. 각 패널 설정 후 **Apply** 클릭
5. 우측 상단 💾 아이콘으로 대시보드 저장

---

## 🎯 실전 모니터링 시나리오

### 시나리오 1: Langflow 성능 문제 발생 시

1. **cAdvisor** (http://localhost:8080)
   - `extendlangflow-langflow-1` 컨테이너 클릭
   - CPU/메모리 급격한 증가 확인

2. **Prometheus** (http://localhost:9090)
   ```promql
   container_memory_usage_bytes{name="extendlangflow-langflow-1"} / 1024 / 1024
   ```
   - 메모리 사용 패턴 분석

3. **Grafana** (http://localhost:3001)
   - 대시보드에서 장기 트렌드 확인
   - 다른 컨테이너와 비교

### 시나리오 2: 전체 시스템 헬스 체크

1. **Grafana 대시보드** 한눈에 확인:
   - 모든 컨테이너 상태
   - CPU/메모리/네트워크 사용률
   - 임계값 초과 여부

2. **알람 설정** (선택):
   - 메모리 > 80% → 알림
   - CPU > 90% → 알림

### 시나리오 3: PostgreSQL 성능 분석

**Prometheus 쿼리:**
```promql
# PostgreSQL 메모리
container_memory_usage_bytes{name="extendlangflow-postgres-1"} / 1024 / 1024

# PostgreSQL CPU
rate(container_cpu_usage_seconds_total{name="extendlangflow-postgres-1"}[5m]) * 100

# PostgreSQL 디스크 I/O
rate(container_fs_writes_bytes_total{name="extendlangflow-postgres-1"}[5m])
```

---

## 📈 권장 대시보드 구성

### 대시보드 1: 시스템 개요
- 전체 컨테이너 상태 (UP/DOWN)
- 총 CPU 사용률
- 총 메모리 사용량
- 네트워크 트래픽

### 대시보드 2: Langflow 상세
- Langflow CPU/메모리 추이
- API 응답 시간 (향후 추가)
- 에러 발생 건수 (향후 추가)

### 대시보드 3: 데이터베이스
- PostgreSQL 메트릭
- 쿼리 성능
- 연결 수

---

## 🔧 고급 기능

### Grafana Alerts 설정

1. 패널 편집 → **Alert** 탭
2. **Create Alert** 클릭
3. 조건 설정:
   ```
   WHEN avg() OF query(A, 5m) IS ABOVE 80
   ```
4. 알림 채널 설정 (이메일, Slack 등)

### Prometheus Alertmanager (선택)

더 복잡한 알림 규칙이 필요한 경우:
```yaml
# docker-compose.yml에 추가
alertmanager:
  image: prom/alertmanager
  ports:
    - "9093:9093"
```

---

## 📚 추가 학습 자료

- **Prometheus 쿼리**: https://prometheus.io/docs/prometheus/latest/querying/basics/
- **Grafana 튜토리얼**: https://grafana.com/tutorials/
- **cAdvisor 문서**: https://github.com/google/cadvisor

---

## 🎓 빠른 시작 체크리스트

- [ ] cAdvisor 접속 → 모든 컨테이너 확인
- [ ] Prometheus Targets 확인 (모두 UP 상태)
- [ ] Grafana 로그인 → Prometheus 데이터 소스 추가
- [ ] Grafana 대시보드 Import (ID: 193)
- [ ] 각 서비스별 메트릭 확인

---

## 💡 팁

1. **Grafana는 필수**, Prometheus는 백그라운드
2. **대시보드 템플릿 활용**하면 5분 안에 구축 가능
3. **알람 설정**으로 문제 조기 발견
4. **정기적으로 모니터링** 습관화
