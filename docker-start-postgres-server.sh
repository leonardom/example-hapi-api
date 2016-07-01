#!/bin/bash
#docker run -v "/$(pwd)/data":"/var/lib/postgresql/data" --name local-postgres -p 5432:5432 -e POSTGRES_PASSWORD=postgres -d postgres
docker run --name local-postgres -p 5432:5432 -e POSTGRES_PASSWORD=postgres -d postgres
