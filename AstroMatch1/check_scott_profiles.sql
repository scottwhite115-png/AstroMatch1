-- Find Scott profiles
SELECT id, display_name, western_sign, chinese_sign, email FROM profiles WHERE display_name ILIKE '%scott%';
