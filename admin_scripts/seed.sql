CREATE USER 'sv'@'%' IDENTIFIED BY 'sv';
ALTER USER 'sv'@'%' IDENTIFIED WITH mysql_native_password BY 'sv';
CREATE DATABASE sv CHARACTER SET utf8 COLLATE utf8_unicode_ci;
GRANT ALL PRIVILEGES ON sv.* TO 'sv'@'%';
