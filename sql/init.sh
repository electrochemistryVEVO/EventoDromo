/opt/mssql/bin/sqlservr &
sleep 90s
/opt/mssql-tools18/bin/sqlcmd -S localhost -U sa -P T8m!r2xZ -C -i myDb.sql
wait
