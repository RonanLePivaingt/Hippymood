#!/bin/bash
# wait-for-mariadb.sh

set -e

host="$1"
shift
cmd="$@"

while ! mysqladmin ping -h"$host" --silent; do
  >&2 echo "Mariadb is unavailable - sleeping"
  sleep 2
done

>&2 echo "Mariadb is up - executing command"

exec $cmd
