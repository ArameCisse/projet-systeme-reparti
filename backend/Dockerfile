FROM python:3.12-slim AS base

ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1

WORKDIR /app

COPY backend/requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY backend/ .

EXPOSE 8000

ENV DJANGO_SETTINGS_MODULE=config.settings

CMD ["sh", "-c", "python manage.py migrate && gunicorn config.wsgi:application --bind 0.0.0.0:8000"]

