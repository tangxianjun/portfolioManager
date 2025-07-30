qls.sh   —  一键执行六个 SQL 脚本
# ------------------------------------------------------------
# 依赖：mysql  CLI 已在 PATH 中
# 环境变量（可在 .zshrc / .bash_profile 中设置，也可临时 export）
#   DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME
# ------------------------------------------------------------

# 读取环境变量，设置默认值
DB_HOST="${DB_HOST:-localhost}"
DB_PORT="${DB_PORT:-3306}"
DB_USER="${DB_USER:-root}"
DB_PASSWORD="${DB_PASSWORD:-}"
DB_NAME="${DB_NAME:-portfolioManager}"

# 需要按顺序执行的 SQL 文件
SQL_FILES=(
  "portfoliomanager_com_icon.sql"
  "portfoliomanager_tickers.sql"
  "portfoliomanager_transaction.sql"
  "portfoliomanager_wealth.sql"
  "portfoliomanager_cash.sql"
  "create_watchlist_table.sql"
)

########################################
# ⬇ 0) 删除现有数据库（如果存在）
########################################
echo "🗑️  Dropping existing database: $DB_NAME (if exists)"
mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" \
      -e "DROP DATABASE IF EXISTS \`$DB_NAME\`;" \
      2>/dev/null
if [[ $? -ne 0 ]]; then
  echo "⚠️  Warning: Cannot drop database $DB_NAME (might not exist or permission issue)"
fi

########################################
# ⬇ 1) 确保数据库存在
########################################
echo "🛠  Creating fresh database: $DB_NAME"
mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" \
      -e "CREATE DATABASE \`$DB_NAME\` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" \
      2>/dev/null
if [[ $? -ne 0 ]]; then
  echo "❌  Cannot create database: $DB_NAME"
  exit 1
fi

########################################
# ⬇ 2) 依次执行 SQL 文件
########################################
echo "🔗 Connecting to ${DB_USER}@${DB_HOST}:${DB_PORT}/${DB_NAME}"
for file in "${SQL_FILES[@]}"; do
  if [[ -f "$file" ]]; then
    echo "▶ Executing $file ..."
    mysql -h "$DB_HOST" -P "$DB_PORT" -u "$DB_USER" -p"$DB_PASSWORD" \
          "$DB_NAME" < "$file"
    if [[ $? -ne 0 ]]; then
      echo "❌  Error while executing $file – script aborted."
      exit 1
    fi
  else
    echo "⚠️  File $file not found – skipped."
  fi
done

echo "✅  All SQL scripts executed successfully."

