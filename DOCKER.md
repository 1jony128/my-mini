# 🐳 ChatAI PRO - Docker Development Guide

## Быстрый старт

### 1. Сборка и запуск одной командой:
```bash
npm run docker:build
```

### 2. Или пошагово:
```bash
# Сборка образа
docker-compose build

# Запуск контейнера
npm run docker:up

# Просмотр логов
npm run docker:logs

# Остановка
npm run docker:down
```

## 🚀 Преимущества Docker решения

### ✅ **Полный контроль над Nginx:**
- Правильная обработка `sitemap.xml` и `robots.txt`
- Настройка кэширования
- Gzip сжатие
- Безопасность (CSP, XSS protection)
- SPA fallback

### ✅ **Консистентность:**
- Одинаковое поведение на dev/staging/production
- Изолированная среда
- Версионирование через Docker tags

### ✅ **Производительность:**
- Оптимизированное кэширование статики
- Сжатие контента
- Правильные HTTP заголовки

## 📁 Структура файлов

```
├── Dockerfile              # Multi-stage сборка
├── docker-compose.yml      # Оркестрация контейнеров
├── nginx.conf              # Конфигурация Nginx
├── .dockerignore           # Исключения для Docker
└── scripts/
    └── docker-build.sh     # Скрипт автоматизации
```

## 🔧 Конфигурация Nginx

### Основные возможности:
- **Статические файлы:** Правильные MIME типы и кэширование
- **SPA Routing:** Fallback на `index.html` для React Router
- **SEO файлы:** Прямая отдача `sitemap.xml`, `robots.txt`
- **Безопасность:** CSP, XSS protection, frame options
- **Производительность:** Gzip, кэширование, expires headers

### Важные location блоки:
```nginx
# SEO файлы
location = /sitemap.xml { ... }
location = /robots.txt { ... }

# Статика с кэшированием
location ~* \.(js|css|png|jpg|...)$ { ... }

# SPA fallback
location / { try_files $uri $uri/ /index.html; }
```

## 🚢 Деплой на продакшн

### Вариант 1: Docker Hub
```bash
# Тагируем образ
docker tag chatai_chatai-app:latest your-registry/chatai-pro:v1.0.0

# Пушим в реестр
docker push your-registry/chatai-pro:v1.0.0
```

### Вариант 2: Прямой деплой
```bash
# На сервере
git clone https://github.com/your-repo/chatai-pro.git
cd chatai-pro
npm run docker:build
```

## 🔍 Отладка

### Проверка контейнера:
```bash
# Статус
docker-compose ps

# Логи
docker-compose logs -f

# Вход в контейнер
docker exec -it chatai-pro sh

# Проверка конфигурации Nginx
docker exec chatai-pro nginx -t
```

### Проверка sitemap.xml:
```bash
# Должен вернуть XML, а не HTML
curl -I http://localhost/sitemap.xml
curl http://localhost/sitemap.xml
```

## 🌐 Использование

После запуска приложение доступно по адресу:
- **Основное приложение:** http://localhost
- **Sitemap:** http://localhost/sitemap.xml
- **Robots:** http://localhost/robots.txt

## 🔄 Обновление

```bash
# Пересборка с обновлениями
npm run docker:down
npm run docker:build
```
