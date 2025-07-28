#!/bin/bash

API_KEY="TN6OVDdI3WDy3_P2ihmv1GQKpBewwNFb"
START_DATE="2025-06-28"
END_DATE="2025-07-28"

# 公司名字（可用于提示）
NAMES=("Apple" "Amazon" "Meta" "NVIDIA" "Alphabet" "Tesla" "Microsoft" "Nike" "Adidas" "Walmart")
# 对应股票代码
TICKERS=("AAPL" "AMZN" "META" "NVDA" "GOOGL" "TSLA" "MSFT" "NKE" "ADDYY" "WMT")

# 检查 jq 是否存在
if ! command -v jq &>/dev/null; then
  echo "❌ 请先安装 jq 工具（用于 JSON 解析）"
  exit 1
fi

# 循环获取每个股票的价格数据
for ((i = 0; i < ${#TICKERS[@]}; i++)); do
  name=${NAMES[$i]}
  ticker=${TICKERS[$i]}
  echo "📡 获取 $name ($ticker)..."

  URL="https://api.polygon.io/v2/aggs/ticker/$ticker/range/1/day/$START_DATE/$END_DATE?adjusted=true&sort=asc&limit=30&apiKey=$API_KEY"

  RESPONSE=$(curl -s "$URL")

  # 检查是否为合法 JSON 并提取
  if echo "$RESPONSE" | jq empty 2>/dev/null; then
    echo "$RESPONSE" | jq '{ticker, results}' > "${ticker}_clean.json"
    echo "✅ 已保存为 ${ticker}_clean.json"
  else
    echo "⚠️ $ticker 返回无效响应或格式错误"
  fi
done

echo "🎉 所有公司处理完毕。"

