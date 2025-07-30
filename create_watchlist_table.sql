-- 创建watchlist表
USE portfoliomanager;

CREATE TABLE IF NOT EXISTS watchlist (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(45) NOT NULL,
    added_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY unique_code (code)
);

-- 添加一些测试数据（可选）
INSERT IGNORE INTO watchlist (code) VALUES 
('MSFT'),
('AAPL'),
('GOOGL'); 