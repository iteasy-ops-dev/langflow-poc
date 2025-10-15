# Prometheus 쿼리 가이드 (컨테이너 이름 기반)

## 🎯 간단한 해결책

컨테이너 이름을 환경변수로 지정하여 ID가 변경되어도 쿼리가 작동하도록 합니다.

---

## 📊 현재 컨테이너 ID 확인

```bash
docker ps --format "{{.ID}}\t{{.Names}}"
```

출력을 복사하여 아래 쿼리의 ID를 업데이트하세요.

---

## 🔍 권장 쿼리 (서비스별)

### Langflow

**메모리 (MB)**
```promql
container_memory_usage_bytes{id=~"/docker/3812.*"} / 1024 / 1024
```

**CPU (%)**
```promql
rate(container_cpu_usage_seconds_total{id=~"/docker/3812.*"}[5m]) * 100
```

### PostgreSQL

**메모리 (MB)**
```promql
container_memory_usage_bytes{id=~"/docker/665d.*"} / 1024 / 1024
```

**CPU (%)**
```promql
rate(container_cpu_usage_seconds_total{id=~"/docker/665d.*"}[5m]) * 100
```

### Frontend

**메모리 (MB)**
```promql
container_memory_usage_bytes{id=~"/docker/afa4.*"} / 1024 / 1024
```

**CPU (%)**
```promql
rate(container_cpu_usage_seconds_total{id=~"/docker/afa4.*"}[5m]) * 100
```

---

## 💡 ID 업데이트 자동화 스크립트

컨테이너 재시작 후 ID가 변경되면 아래 스크립트로 새 ID를 확인하세요:

```bash
#!/bin/bash
echo "=== 현재 컨테이너 ID (앞 4자리) ==="
docker ps --format "{{.Names}}" | grep extendlangflow | while read name; do
  id=$(docker ps --filter "name=$name" --format "{{.ID}}" | cut -c1-4)
  service=$(echo $name | sed 's/extendlangflow-\(.*\)-1/\1/')
  echo "$service: $id"
done
```

저장 후 실행:
```bash
chmod +x check-ids.sh
./check-ids.sh
```

---

## 🎨 Grafana 대시보드 설정

### 패널 1: 서비스별 메모리 사용량

여러 쿼리를 추가하여 비교:

**Query A (Langflow)**
```promql
container_memory_usage_bytes{id=~"/docker/3812.*"} / 1024 / 1024
```
Legend: `Langflow`

**Query B (PostgreSQL)**
```promql
container_memory_usage_bytes{id=~"/docker/665d.*"} / 1024 / 1024
```
Legend: `PostgreSQL`

**Query C (Frontend)**
```promql
container_memory_usage_bytes{id=~"/docker/afa4.*"} / 1024 / 1024
```
Legend: `Frontend`

Visualization: Time series

---

### 패널 2: 전체 CPU 사용률

```promql
sum(rate(container_cpu_usage_seconds_total{id=~"/docker/(3812|665d|afa4).*"}[5m])) * 100
```

Visualization: Gauge  
Unit: Percent (0-100)

---

### 패널 3: 네트워크 트래픽 (Langflow)

**수신**
```promql
rate(container_network_receive_bytes_total{id=~"/docker/3812.*"}[5m])
```

**송신**
```promql
rate(container_network_transmit_bytes_total{id=~"/docker/3812.*"}[5m])
```

Visualization: Time series  
Unit: bytes/sec

---

## ⚙️ ID 변경 시 대처 방법

### 방법 1: Grafana 변수 사용

1. Dashboard settings → Variables → New variable
2. Name: `langflow_id`
3. Type: `Query`
4. Query: `label_values(container_memory_usage_bytes{id=~"/docker/.*langflow.*"}, id)`
5. 패널 쿼리를 변경:
   ```promql
   container_memory_usage_bytes{id=~"$langflow_id"} / 1024 / 1024
   ```

### 방법 2: 정규식 패턴 확장

모든 컨테이너를 포함:
```promql
container_memory_usage_bytes{id=~"/docker/[0-9a-f]+"}
```

단, 이 경우 서비스 구분이 어려우므로 방법 1을 권장합니다.

---

## 🚀 빠른 시작

1. **ID 확인**
   ```bash
   docker ps --format "{{.ID}}\t{{.Names}}" | grep extendlangflow
   ```

2. **Prometheus에서 테스트**
   - http://localhost:9090
   - Graph 메뉴
   - 쿼리 입력 후 Execute

3. **Grafana 대시보드 생성**
   - http://localhost:3001
   - Import Dashboard 193
   - 또는 직접 패널 추가

---

## 📝 참고사항

- POC 목적이므로 ID 기반 쿼리로도 충분합니다
- 운영 환경에서는 `container_label` 기반 쿼리 권장
- 컨테이너 재시작은 드물므로 수동 업데이트로 관리 가능

---

## 문의

질문이 있으시면 MONITORING.md를 참조하세요.
