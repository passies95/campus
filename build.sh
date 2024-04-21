#!/usr/bin/env bash
# Exit on error
set -o errexit

# Modify this line as needed for your package manager (pip, poetry, etc.)
# Check system architecture
# architecture=$(uname -m)
# echo "System architecture: $architecture"
# Check if gdal is installed
gdalinfo --version

pip install -r requirements.txt

# Convert static asset files
python manage.py collectstatic --no-input

# Apply any outstanding database migrations
python manage.py migrate