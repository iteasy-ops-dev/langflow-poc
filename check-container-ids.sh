#!/bin/bash

echo "=== 현재 컨테이너 ID 매핑 ==="
echo ""
echo "| 서비스 | 컨테이너 ID (앞 4자리) |"
echo "|--------|------------------------|"

docker ps --format "{{.Names}}" | grep extendlangflow | sort | while read name; do
  id=$(docker ps --filter "name=$name" --format "{{.ID}}" | cut -c1-4)
  service=$(echo $name | sed 's/extendlangflow-\(.*\)-1/\1/')
  echo "| $service | $id |"
done

echo ""
echo "Prometheus 쿼리에 위 ID를 사용하세요."
echo "예: container_memory_usage_bytes{id=~\"/docker/$id.*\"}"
