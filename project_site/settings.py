"""
Django settings for project_site project.

Generated by 'django-admin startproject' using Django 4.1.7.

For more information on this file, see
https://docs.djangoproject.com/en/4.1/topics/settings/

For the full list of settings and their values, see
https://docs.djangoproject.com/en/4.1/ref/settings/
"""

import os
from pathlib import Path

import environ
from django.utils.translation import gettext_lazy as _

import sentry_sdk


# Build paths inside the project like this: BASE_DIR / 'subdir'.
BASE_DIR = Path(__file__).resolve().parent.parent
MEDIA_ROOT = os.path.join(BASE_DIR, "media")
MEDIA_URL = "/media/"


STATIC_URL = "/static_output/"
STATIC_ROOT = os.path.join(BASE_DIR, "static_output/")


# Initialise environment variables
env = environ.Env()
environ.Env.read_env(os.path.join(BASE_DIR, ".env"))


# Quick-start development settings - unsuitable for production
# See https://docs.djangoproject.com/en/4.1/howto/deployment/checklist/

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = env("SECRET_KEY")

# SECURITY WARNING: don't run with debug turned on in production!
DEBUG = env.bool("DEBUG")
DEBUG_PROPAGATE_EXCEPTIONS = DEBUG


sentry_sdk.init(
    dsn=env("SENTRY_DSN", default=None) if not DEBUG else "",
    # Set traces_sample_rate to 1.0 to capture 100%
    # of transactions for tracing.
    traces_sample_rate=env.float("SENTRY_SAMPLE_RATE", default=0),
    # Set profiles_sample_rate to 1.0 to profile 100%
    # of sampled transactions.
    # We recommend adjusting this value in production.
    profiles_sample_rate=env.float("SENTRY_SAMPLE_RATE", default=0),
    _experiments={
        # Set continuous_profiling_auto_start to True
        # to automatically start the profiler on when
        # possible.
        "continuous_profiling_auto_start": True,
    },
)


ALLOWED_HOSTS = ["*"]

# Application definition

INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "rest_framework",
    "django_filters",
    "safedelete",
    "apps.users_app",
    "apps.common",
    "apps.business_app",
    "apps.clients_app",
    "django_extensions",
    "solo",
    "drf_spectacular",
    "drf_spectacular_sidecar",  # required for Django collectstatic discovery
    "apps.common.middlewares",
]
WEBSITE_NAME = env("WEBSITE_NAME", default="My website")
WEBSITE_SLUG_NAME = env("WEBSITE_SLUG_NAME", default="my_website")


SPECTACULAR_SETTINGS = {
    "SWAGGER_UI_DIST": "SIDECAR",  # shorthand to use the sidecar instead
    "SWAGGER_UI_FAVICON_HREF": "SIDECAR",
    "REDOC_DIST": "SIDECAR",
    "TITLE": f"{WEBSITE_NAME} API",
    "DESCRIPTION": f"Api de {WEBSITE_NAME}",
    "VERSION": "1.0.0",
    "SERVE_INCLUDE_SCHEMA": False,
    # OTHER SETTINGS
}

MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django_session_timeout.middleware.SessionTimeoutMiddleware",
    "django.middleware.locale.LocaleMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
    "apps.common.middlewares.GetRequestUserMiddleware",
]


ROOT_URLCONF = "project_site.urls"

SESSION_EXPIRE_SECONDS = env.int("SESSION_EXPIRE_SECONDS")
SESSION_EXPIRE_AFTER_LAST_ACTIVITY = True
SESSION_TIMEOUT_REDIRECT = "/"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [os.path.join(BASE_DIR, "templates")],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

LOCALE_PATHS = [os.path.join(BASE_DIR, "locale")]

WSGI_APPLICATION = "project_site.wsgi.application"


RUNNING_FROM_LOCAL = "local"
RUNNING_FROM_REMOTE = "remote"
RUNNING_FROM = env("RUNNING_FROM", default=RUNNING_FROM_LOCAL)


# Database
# https://docs.djangoproject.com/en/4.1/ref/settings/#databases

if RUNNING_FROM == RUNNING_FROM_LOCAL:
    conexion = {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
else:
    conexion = {
        "ENGINE": env("DB_REMOTE_ENGINE"),
        "NAME": f"{WEBSITE_SLUG_NAME}_db",
        "USER": env("DB_REMOTE_USER"),
        "PASSWORD": env("DB_REMOTE_PASSWORD"),
        "HOST": env("DB_REMOTE_HOST"),
        "PORT": env.int("DB_REMOTE_PORT"),
    }

DATABASES = {
    "default": conexion,
}

# Password validation
# https://docs.djangoproject.com/en/4.1/ref/settings/#auth-password-validators

AUTH_PASSWORD_VALIDATORS = [
    {
        "NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",  # noqa: E501
    },
    {
        "NAME": "django.contrib.auth.password_validation.MinimumLengthValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.CommonPasswordValidator",
    },
    {
        "NAME": "django.contrib.auth.password_validation.NumericPasswordValidator",
    },
]

INTERNAL_IPS = [
    # ...
    "127.0.0.1",
    # ...
]

if DEBUG:
    import socket  # only if you haven't already imported this

    hostname, _, ips = socket.gethostbyname_ex(socket.gethostname())  # noqa: F811
    INTERNAL_IPS = [ip[: ip.rfind(".")] + ".1" for ip in ips] + [
        "127.0.0.1",
        "10.0.2.2",
    ]
# Internationalization
# https://docs.djangoproject.com/en/4.1/topics/i18n/


LANGUAGE_CODE = "es-es"
# LANGUAGE_CODE = "en-us"

# LANGUAGES = [
#     ("es", "German"),
#     ("en", "English"),
# ]

TIME_ZONE = "America/Havana"

USE_I18N = True

USE_TZ = False


# when the static files are outside the application folder this code is put:
# cuando los ficheros estáticos están fuera de la
# carpeta de la aplicación se pone este código

STATICFILES_DIRS = [
    BASE_DIR / "static",
]

# Default primary key field type
# https://docs.djangoproject.com/en/4.1/ref/settings/#default-auto-field

DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

REST_FRAMEWORK = {
    # Use Django's standard `django.contrib.auth` permissions,
    # or allow read-only access for unauthenticated users.
    # 'DEFAULT_PERMISSION_CLASSES': [
    #     'rest_framework.permissions.DjangoModelPermissionsOrAnonReadOnly'
    # ],
    # "DEFAULT_PAGINATION_CLASS": "rest_framework.pagination.PageNumberPagination",
    "DEFAULT_PAGINATION_CLASS": "apps.common.pagination.StandardResultsSetPagination",
    "PAGE_SIZE": 10,
    "DEFAULT_SCHEMA_CLASS": "drf_spectacular.openapi.AutoSchema",
    "DEFAULT_AUTHENTICATION_CLASSES": [
        "rest_framework.authentication.SessionAuthentication",
    ],
    "DEFAULT_PERMISSION_CLASSES": [
        "rest_framework.permissions.IsAuthenticated",
    ],
    "DEFAULT_RENDERER_CLASSES": (
        "drf_orjson_renderer.renderers.ORJSONRenderer",
        "rest_framework.renderers.BrowsableAPIRenderer",
    ),
}

LOGGING = {
    "version": 1,  # the dictConfig format version
    "disable_existing_loggers": False,  # retain the default loggers
    "filters": {
        "require_debug_false": {
            "()": "django.utils.log.RequireDebugFalse",
        },
    },
    "handlers": {
        "file": {
            "class": "logging.FileHandler",
            "filename": "registered_warnings_and_errors.log",
            "level": "ERROR",
            "formatter": "verbose",
        },
        "mail_admins": {
            "level": "ERROR",
            "class": "django.utils.log.AdminEmailHandler",
            "include_html": True,
        },
    },
    "loggers": {
        "": {
            "level": "ERROR",
            "handlers": ["file"],
        },
    },
    "formatters": {
        "verbose": {
            "format": "{name} {levelname} {asctime} {module} <{message}>",
            "style": "{",
        },
        "simple": {
            "format": "{levelname} {message}",
            "style": "{",
        },
    },
}

CACHE_DEFAULT_TIMEOUT = env.int("CACHE_DEFAULT_TIMEOUT", default=300)
CACHES = {
    "default": {
        "BACKEND": "django.core.cache.backends.dummy.DummyCache"
        if DEBUG
        else "django.core.cache.backends.redis.RedisCache",
        "LOCATION": f"redis://127.0.0.1:{env.int('REDIS_PORT', default=6379)}",
        "TIMEOUT": CACHE_DEFAULT_TIMEOUT,
    }
}
