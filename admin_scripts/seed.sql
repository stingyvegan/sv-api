CREATE USER 'sv'@'%' IDENTIFIED BY 'sv';
ALTER USER 'sv'@'%' IDENTIFIED WITH mysql_native_password BY 'sv';
CREATE DATABASE sv;
GRANT ALL PRIVILEGES ON sv.* TO 'sv'@'%';
