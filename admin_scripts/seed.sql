CREATE USER 'sv'@'%' IDENTIFIED BY 'sv';
GRANT ALL PRIVILEGES ON *.* TO 'sv'@'%';
CREATE DATABASE sv;
GRANT ALL PRIVILEGES ON sv.* TO 'sv'@'%';