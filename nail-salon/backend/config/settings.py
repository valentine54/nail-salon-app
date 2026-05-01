import os
SECRET_KEY = 'django-insecure-4h-presentation-key-2024'
DEBUG = True
ALLOWED_HOSTS = ['*']
INSTALLED_APPS = ['django.contrib.admin','django.contrib.auth','django.contrib.contenttypes','django.contrib.sessions','django.contrib.messages','django.contrib.staticfiles','rest_framework','corsheaders','api' ]
MIDDLEWARE = ['corsheaders.middleware.CorsMiddleware','django.middleware.security.SecurityMiddleware','django.contrib.sessions.middleware.SessionMiddleware','django.middleware.common.CommonMiddleware','django.middleware.csrf.CsrfViewMiddleware','django.contrib.auth.middleware.AuthenticationMiddleware','django.contrib.messages.middleware.MessageMiddleware']
CORS_ALLOW_ALL_ORIGINS = True
ROOT_URLCONF = 'config.urls'
DATABASES = {'default': {'ENGINE': 'django.db.backends.sqlite3','NAME': os.path.join(os.path.dirname(__file__), 'db.sqlite3')}}
TEMPLATES = [{'BACKEND': 'django.template.backends.django.DjangoTemplates','DIRS': [],'APP_DIRS': True,'OPTIONS': {'context_processors': ['django.template.context_processors.debug','django.template.context_processors.request','django.contrib.auth.context_processors.auth','django.contrib.messages.context_processors.messages']}}]
DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'
MEDIA_URL = '/media/'
MEDIA_ROOT = os.path.join(os.path.dirname(__file__), 'media')
STATIC_URL = '/static/'