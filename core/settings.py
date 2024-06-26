"""
Django settings for core project.

Generated by 'django-admin startproject' using Django 4.2.6.

For more information on this file, see
https://docs.djangoproject.com/en/4.2/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.2/ref/settings/
"""

import os
from pathlib import Path
from django.conf.urls.static import static
import dj_database_url
from dotenv import load_dotenv
import ast

# Load environment variables from .env file
load_dotenv()

# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = os.getenv('SECRET_KEY')
DATABASE_URL = os.getenv('DATABASE_URL')

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = ast.literal_eval(os.getenv('DEBUG', 'False'))
# DEBUG = True

# Add the local computed Ip address to the list of allowed hosts
# This should be removed during deployement

ALLOWED_HOSTS = ["*"]


# Application definition

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'django.contrib.sessions',
    "django.contrib.gis",
    'leaflet',
    'djgeojson',
    'campusfront',
    # 'import_export',

]

MIDDLEWARE = [
    'django.middleware.security.SecurityMiddleware',
    'whitenoise.middleware.WhiteNoiseMiddleware', 
    'django.contrib.sessions.middleware.SessionMiddleware',
    'django.middleware.common.CommonMiddleware',
    'django.middleware.csrf.CsrfViewMiddleware',
    'django.contrib.auth.middleware.AuthenticationMiddleware',
    'django.contrib.messages.middleware.MessageMiddleware',
    'django.middleware.clickjacking.XFrameOptionsMiddleware',
]

ROOT_URLCONF = 'core.urls'

TEMPLATES = [
    {
        'BACKEND': 'django.template.backends.django.DjangoTemplates',
        'DIRS': [],
        'APP_DIRS': True,
        'OPTIONS': {
            'context_processors': [
                'django.template.context_processors.debug',
                'django.template.context_processors.request',
                'django.contrib.auth.context_processors.auth',
                'django.contrib.messages.context_processors.messages',
            ],
        },
    },
]

WSGI_APPLICATION = 'core.wsgi.application'


# Database
# https://docs.djangoproject.com/en/4.2/ref/settings/#databases

DATABASES = {
    'default': dj_database_url.config(
        default=DATABASE_URL, 
        engine='django.contrib.gis.db.backends.postgis'
    )
}


# Password validation
# https://docs.djangoproject.com/en/4.2/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        'NAME': 'django.contrib.auth.password_validation.UserAttributeSimilarityValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.MinimumLengthValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.CommonPasswordValidator',
    },
    {
        'NAME': 'django.contrib.auth.password_validation.NumericPasswordValidator',
    },
]


# Internationalization
# https://docs.djangoproject.com/en/4.2/topics/i18n/

LANGUAGE_CODE = 'en-us'

TIME_ZONE = 'Africa/Nairobi'

USE_I18N = True

USE_TZ = True


# Static files (CSS, JavaScript, Images)
# https://docs.djangoproject.com/en/4.2/howto/static-files/

STATIC_URL = 'static/'

MEDIA_URL = '/media/'

MEDIA_ROOT = os.path.join(BASE_DIR, 'media')

if not DEBUG:    # Tell Django to copy static assets into a path called `staticfiles` (this is specific to Render)
    STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
    # MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
    # Enable the WhiteNoise storage backend, which compresses static files to reduce disk use
    # and renames the files with unique names for each version to support long-term caching
    # STATICFILES_STORAGE = 'whitenoise.storage.CompressedManifestStaticFilesStorage'
    STORAGES = {
        "staticfiles": {
            "BACKEND": "whitenoise.storage.CompressedManifestStaticFilesStorage",
        },
    }
    WHITENOISE_SKIP_COMPRESS_EXTENSIONS = (
    '.jpg', '.jpeg', '.png', '.gif',  
    )
else:
    STATIC_URL = '/static/'

# Default primary key field type
# https://docs.djangoproject.com/en/4.2/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'


# Set the following paths for use within windows
# Paths may not work on other systems
if os.name == 'nt':  # Check if the operating system is Windows
    GDAL_LIBRARY_PATH = r'C:\OSGeo4W64\bin\gdal301'
    GEOS_LIBRARY_PATH = r'C:\OSGeo4W64\bin\geos_c.dll'
    PROJ_LIBRARY_PATH = r'C:\OSGeo4W64\bin\proj'

# Leafet configurations

# from django.contrib.gis import gdal
# from leaflet import app_settings

LEAFLET_CONFIG = {
    'DEFAULT_CENTER': (-1.2798182,36.8166271),
    'DEFAULT_ZOOM': 14,
    'MIN_ZOOM': 16,
    'MAX_ZOOM': 22,
    'DEFAULT_PRECISION': 6,
    # 'TILES': [],

    'PLUGINS': {
        'AwesomeMarkers': {
            'css': ['https://code.ionicframework.com/ionicons/1.5.2/css/ionicons.min.css', 'package/awesome-markers/leaflet.awesome-markers.css'],
            'js': 'package/awesome-markers/leaflet.awesome-markers.js',
            'auto-include': True,
        },
        'georaster': {
            'js': 'https://unpkg.com/georaster',
            'auto-include': True,
        },
        'GeoRasterLayer': {
            'js': 'https://unpkg.com/georaster-layer-for-leaflet',
            'auto-include': True,
        },
        'Leaflet.Control.Search': {
            'css': 'css/leaflet-search.min.css',
            'js': 'js/leaflet-search.min.js',
            'auto-include': True,
        },
        'leaflet-panel-layers': {
            'css': 'css/leaflet-panel-layers.min.css',
            'js': 'js/leaflet-panel-layers.min.js',
            'auto-include': True,
        },
        'leaflet-routing-machine': {
            'css': 'https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.css',
            'js': 'https://unpkg.com/leaflet-routing-machine@latest/dist/leaflet-routing-machine.js',
            'auto-include': True,
        },
    }
}

# # Import Export configuration
# IMPORT_EXPORT_USE_TRANSACTIONS = True
# IMPORT_EXPORT_SKIP_ADMIN_LOG = True

# from import_export.formats.base_formats import CSV, XLSX
# IMPORT_FORMATS = [CSV, XLSX]
# EXPORT_FORMATS = [XLSX]
