#!/bin/bash

echo "🚀 Продакшн деплой ChatAI PRO с пререндерингом..."

# Проверяем Docker (только если не в контейнере)
if [ -z "$DOCKER_CONTAINER" ] && ! command -v docker &> /dev/null; then
    echo "❌ Docker не установлен!"
    exit 1
fi

# Создаем директории для логов
mkdir -p logs

# Останавливаем существующие контейнеры
echo "🛑 Останавливаем существующие контейнеры..."
docker-compose -f docker-compose.production.yml down

# Удаляем старые образы
echo "🗑️ Очищаем старые образы..."
docker system prune -f

# Собираем новый образ
echo "🔨 Собираем продакшн образ с пререндерингом..."
docker-compose -f docker-compose.production.yml build --no-cache

# Запускаем основной сервис
echo "▶️ Запускаем продакшн сервис..."
docker-compose -f docker-compose.production.yml up -d chatai-app

# Ждем запуска основного сервиса
echo "⏳ Ждем запуска сервиса..."
sleep 10

# Запускаем воркер для пререндеринга (если нужно)
echo "🎨 Запускаем пререндеринг..."
docker-compose -f docker-compose.production.yml --profile tools run --rm prerender-worker

# Показываем статус
echo "📊 Статус сервисов:"
docker-compose -f docker-compose.production.yml ps

# Тестируем sitemap.xml
echo "🔍 Тестируем sitemap.xml..."
sleep 5
curl -I http://localhost/sitemap.xml

echo ""
echo "✅ Продакшн деплой завершен!"
echo "🌐 Сайт: http://localhost"
echo "🗺️ Sitemap: http://localhost/sitemap.xml"
echo "🤖 Robots: http://localhost/robots.txt"
echo "🐛 Debug: http://localhost/debug/prerender"
echo ""
echo "📋 Полезные команды:"
echo "  Логи: docker-compose -f docker-compose.production.yml logs -f"
echo "  Остановка: docker-compose -f docker-compose.production.yml down"
echo "  Пререндеринг: docker-compose -f docker-compose.production.yml --profile tools run --rm prerender-worker"
