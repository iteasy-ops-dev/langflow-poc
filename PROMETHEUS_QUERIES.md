# Prometheus 쿼리 가이드

## 📊 컨테이너 ID 매핑

| 서비스 | 컨테이너 ID (앞 4자리) | 전체 이름 |
|--------|----------------------|-----------|
| Langflow | 3812 | extendlangflow-langflow-1 |
| PostgreSQL | 665d | extendlangflow-postgres-1 |
| Frontend | afa4 | extendlangflow-frontend-1 |
| PgAdmin | b2a7 | extendlangflow-pgadmin-1 |
| Grafana | 45f7 | extendlangflow-grafana-1 |
| Prometheus | 59a0 | extendlangflow-prometheus-1 |
| cAdvisor | 7681 | extendlangflow-cadvisor-1 |

> **참고**: 컨테이너를 재시작하면 ID가 변경됩니다. `docker ps`로 최신 ID 확인 필요.

---

## 🔍 Prometheus UI에서 사용 가능한 쿼리

### 1. Langflow 메모리 사용량 (MB)

```promql
container_memory_usage_bytes{id=~"/docker/3812.*"} / 1024 / 1024
```

### 2. Langflow CPU 사용률 (%)

```promql
rate(container_cpu_usage_seconds_total{id=~"/docker/3812.*"}[5m]) * 100
```

### 3. PostgreSQL 메모리 사용량 (MB)

```promql
container_memory_usage_bytes{id=~"/docker/665d.*"} / 1024 / 1024
```

### 4. PostgreSQL CPU 사용률 (%)

```promql
rate(container_cpu_usage_seconds_total{id=~"/docker/665d.*"}[5m]) * 100
```

### 5. Frontend 메모리 사용량 (MB)

```promql
container_memory_usage_bytes{id=~"/docker/afa4.*"} / 1024 / 1024
```

### 6. 전체 컨테이너 메모리 합계 (GB)

```promql
sum(container_memory_usage_bytes{id=~"/docker/(3812|665d|afa4).*"}) / 1024 / 1024 / 1024
```

### 7. Langflow 네트워크 수신 (bytes/sec)

```promql
rate(container_network_receive_bytes_total{id=~"/docker/3812.*"}[5m])
```

### 8. Langflow 네트워크 송신 (bytes/sec)

```promql
rate(container_network_transmit_bytes_total{id=~"/docker/3812.*"}[5m])
```

### 9. PostgreSQL 디스크 읽기 (bytes/sec)

```promql
rate(container_fs_reads_bytes_total{id=~"/docker/665d.*"}[5m])
```

### 10. PostgreSQL 디스크 쓰기 (bytes/sec)

```promql
rate(container_fs_writes_bytes_total{id=~"/docker/665d.*"}[5m])
```

---

## 🎯 Prometheus UI 사용법

1. **Prometheus 접속**: http://localhost:9090
2. **Graph 메뉴** 클릭
3. **Expression 입력창**에 위 쿼리 복사/붙여넣기
4. **Execute** 버튼 클릭
5. **Graph 탭**에서 시각화 확인

---

## 📈 Grafana에서 사용하는 쿼리

Grafana 대시보드 패널을 만들 때 동일한 쿼리를 사용합니다.

### 패널 1: Langflow 메모리 추이

**Query:**
```promql
container_memory_usage_bytes{id=~"/docker/3812.*"} / 1024 / 1024
```

**설정:**
- Visualization: Time series
- Unit: megabytes
- Panel title: "Langflow Memory Usage"

### 패널 2: 전체 CPU 사용률

**Query:**
```promql
sum(rate(container_cpu_usage_seconds_total{id=~"/docker/(3812|665d|afa4).*"}[5m])) * 100
```

**설정:**
- Visualization: Gauge
- Unit: percent (0-100)
- Panel title: "Total CPU Usage"

### 패널 3: 컨테이너별 메모리 비교

**Query A (Langflow):**
```promql
container_memory_usage_bytes{id=~"/docker/3812.*"} / 1024 / 1024
```

**Query B (PostgreSQL):**
```promql
container_memory_usage_bytes{id=~"/docker/665d.*"} / 1024 / 1024
```

**Query C (Frontend):**
```promql
container_memory_usage_bytes{id=~"/docker/afa4.*"} / 1024 / 1024
```

**설정:**
- Visualization: Bar chart
- Unit: megabytes
- Legend: Langflow, PostgreSQL, Frontend

---

## 🔄 컨테이너 ID 업데이트 방법

컨테이너가 재시작되면 ID가 변경됩니다. 새 ID 확인:

```bash
docker ps --format "table {{.ID}}\t{{.Names}}"
```

출력 예:
```
ID            NAMES
3812661250db  extendlangflow-langflow-1
665dd2980f0d  extendlangflow-postgres-1
afa467a9b96b  extendlangflow-frontend-1
```

새 ID의 앞 4자리를 쿼리에 업데이트하세요.

---

## 💡 정규식 패턴 설명

- `id=~"/docker/3812.*"` 
  - `=~`: 정규식 매칭
  - `/docker/3812.*`: "/docker/3812"로 시작하는 모든 ID
  - `.`*: 뒤에 오는 모든 문자

---

## 🎓 고급 쿼리

### 최근 1시간 평균 메모리

```promql
avg_over_time(container_memory_usage_bytes{id=~"/docker/3812.*"}[1h]) / 1024 / 1024
```

### 메모리 사용량 증가율

```promql
rate(container_memory_usage_bytes{id=~"/docker/3812.*"}[5m])
```

### 네트워크 총 트래픽 (수신 + 송신)

```promql
rate(container_network_receive_bytes_total{id=~"/docker/3812.*"}[5m]) + 
rate(container_network_transmit_bytes_total{id=~"/docker/3812.*"}[5m])
```

---

## ⚠️ 주의사항

1. **컨테이너 재시작 시 ID 변경**
   - `docker compose restart` 후 ID가 바뀌면 쿼리도 업데이트 필요
   
2. **정규식 사용**
   - 앞 4자리만 사용하여 ID 변경에 어느 정도 대응
   
3. **시간 범위**
   - `[5m]`: 최근 5분
   - `[1h]`: 최근 1시간
   - `[1d]`: 최근 1일

---

## 🚀 빠른 테스트

Prometheus UI에서 다음 쿼리로 바로 테스트:

```promql
# 모든 컨테이너 메모리 보기
container_memory_usage_bytes{id=~"/docker/.*"}

# Langflow만 보기
container_memory_usage_bytes{id=~"/docker/3812.*"}
```

성공하면 결과가 표시됩니다! ✅
