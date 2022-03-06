-- create db

select pg_terminate_backend(pid) from pg_stat_activity where datname='template1';

SELECT 'CREATE DATABASE sv'
WHERE NOT EXISTS (SELECT FROM pg_database WHERE datname = 'sv')\gexec

\c sv

create schema IF NOT EXISTS sv;
create role sv with password 'sv';

-- create role
ALTER ROLE sv WITH LOGIN;
grant all privileges on schema sv to sv;
grant all privileges on schema sv to postgres;

-- add search path
alter user sv set search_path="$user",public,sv;
alter user postgres set search_path="$user",public,sv;

show search_path;
