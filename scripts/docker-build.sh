#!/bin/bash

# Скрипт для сборки и запуска Docker контейнера

echo "🚀 Начинаем сборку ChatAI PRO Docker образа..."

# Останавливаем и удаляем существующие контейнеры
echo "🛑 Останавливаем существующие контейнеры..."
docker-compose down

# Удаляем старый образ (опционально)
echo "🗑️ Удаляем старый образ..."
docker rmi chatai_chatai-app 2>/dev/null || true

# Собираем новый образ
echo "🔨 Собираем новый образ..."
docker-compose build --no-cache

# Запускаем контейнер
echo "▶️ Запускаем контейнер..."
docker-compose up -d

# Показываем статус
echo "📊 Статус контейнеров:"
docker-compose ps

echo "✅ ChatAI PRO запущен на http://localhost"
echo "📋 Логи: docker-compose logs -f"
echo "🛑 Остановка: docker-compose down"
