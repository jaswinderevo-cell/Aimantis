#!/bin/bash
# entrypoint.sh

# Run migrations
python manage.py migrate

# Start the Django server
exec "$@"
