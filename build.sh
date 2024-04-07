#!/usr/bin/env bash
# Exit on error
set -o errexit

# Modify this line as needed for your package manager (pip, poetry, etc.)
# Check system architecture
# architecture=$(uname -m)
# echo "System architecture: $architecture"
# Insta;=ll gdal
gdalinfo --version
# cd binaries/gdal-3.6.2
# ./configure --prefix=$HOME/gdal
# make
# make install
# echo 'export PATH=$HOME/gdal/bin:$PATH' >> ~/.bashrc
# echo 'export LD_LIBRARY_PATH=$HOME/gdal/lib:$LD_LIBRARY_PATH' >> ~/.bashrc
# source ~/.bashrc
# # Verify gdal Installation
# gdalinfo --version

pip install -r requirements.txt

# Convert static asset files
python manage.py collectstatic --no-input

# Apply any outstanding database migrations
python manage.py migrate