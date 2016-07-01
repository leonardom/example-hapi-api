#!/bin/bash
docker run -it --rm --link local-postgres:postgres postgres psql -h postgres -U postgres
