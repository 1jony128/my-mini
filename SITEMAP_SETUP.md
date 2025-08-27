# Настройка Sitemap для поисковых систем

## Что уже настроено

✅ **robots.txt** - содержит ссылку на sitemap: `https://aichat-pro.ru/sitemap.xml`
✅ **sitemap.ts** - генерирует XML sitemap для всех страниц сайта
✅ **layout.tsx** - содержит ссылку на sitemap в head секции

## Настройка в Google Search Console

1. **Войдите в Google Search Console**: https://search.google.com/search-console
2. **Добавьте свой сайт** (если еще не добавлен):
   - Введите URL: `https://aichat-pro.ru`
   - Подтвердите владение сайтом (через HTML тег или DNS)
3. **Отправьте sitemap**:
   - В левом меню выберите "Sitemaps"
   - Введите URL sitemap: `https://aichat-pro.ru/sitemap.xml`
   - Нажмите "Отправить"

## Настройка в Яндекс.Вебмастер

1. **Войдите в Яндекс.Вебмастер**: https://webmaster.yandex.ru
2. **Добавьте свой сайт** (если еще не добавлен):
   - Введите URL: `https://aichat-pro.ru`
   - Подтвердите владение сайтом
3. **Отправьте sitemap**:
   - В левом меню выберите "Индексирование" → "Файлы Sitemap"
   - Введите URL sitemap: `https://aichat-pro.ru/sitemap.xml`
   - Нажмите "Добавить"

## Проверка работы sitemap

1. **Проверьте доступность sitemap**: 
   - Откройте в браузере: `https://aichat-pro.ru/sitemap.xml`
   - Должен отобразиться XML файл с картой сайта

2. **Проверьте robots.txt**:
   - Откройте в браузере: `https://aichat-pro.ru/robots.txt`
   - Должна быть строка: `Sitemap: https://aichat-pro.ru/sitemap.xml`

## Дополнительные рекомендации

### Для Google Search Console:
- Настройте уведомления о новых sitemap
- Мониторьте ошибки индексации
- Проверяйте статус отправленных sitemap

### Для Яндекс.Вебмастер:
- Настройте уведомления о новых sitemap
- Мониторьте статистику индексации
- Проверяйте ошибки в файлах sitemap

## Автоматическое обновление

Sitemap автоматически обновляется при каждом деплое, так как:
- `lastModified: new Date()` - устанавливает текущую дату
- Next.js автоматически генерирует XML из `sitemap.ts`

## Мониторинг

Регулярно проверяйте в поисковых системах:
- Статус индексации страниц
- Ошибки в sitemap
- Скорость индексации новых страниц
