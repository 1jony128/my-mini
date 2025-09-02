import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Простой пререндеринг без сервера - просто создаем HTML файлы с мета-тегами
const routes = [
  {
    path: '/',
    title: 'ChatAI PRO - Чат GPT без VPN | Бесплатный доступ к ИИ',
    description: 'Доступ к GPT-4, Claude, DeepSeek и другим ИИ-моделям без VPN. Общайтесь с искусственным интеллектом без ограничений.',
    keywords: 'чат гпт без впн, чат gpt без vpn, gpt 4 без впн, gpt 5 без впн, чат с ии, искусственный интеллект'
  },
  {
    path: '/gpt-bez-vpn',
    title: 'ЧАТ ГПТ БЕЗ ВПН - Доступ к GPT-4 без VPN | ChatAI PRO',
    description: 'Чат ГПТ без ВПН - прямой доступ к GPT-4, GPT-3.5 и другим моделям OpenAI. Работает из России без VPN и блокировок.',
    keywords: 'чат гпт без впн, gpt без vpn, chatgpt без впн, gpt 4 без vpn, openai без vpn'
  },
  {
    path: '/login',
    title: 'Вход в ChatAI PRO - Доступ к GPT-4 и Claude',
    description: 'Войдите в ChatAI PRO для полного доступа к GPT-4, Claude, DeepSeek и другим ИИ-моделям.',
    keywords: 'вход chatai pro, логин gpt, авторизация ии чат'
  },
  {
    path: '/register',
    title: 'Регистрация в ChatAI PRO - Бесплатный старт с ИИ',
    description: 'Зарегистрируйтесь в ChatAI PRO и получите бесплатный доступ к GPT-4, Claude и другим ИИ-моделям.',
    keywords: 'регистрация chatai, создать аккаунт gpt, бесплатный чат ии'
  },
  {
    path: '/blog',
    title: 'Блог ChatAI PRO - Новости ИИ и GPT технологий',
    description: 'Читайте последние новости об искусственном интеллекте, GPT-4, Claude и других ИИ-технологиях.',
    keywords: 'блог ии, новости gpt, статьи искусственный интеллект'
  },
  {
    path: '/privacy',
    title: 'Политика конфиденциальности | ChatAI PRO',
    description: 'Политика конфиденциальности ChatAI PRO - как мы защищаем ваши данные при использовании ИИ-сервисов.',
    keywords: 'политика конфиденциальности, защита данных, приватность'
  },
  {
    path: '/terms',
    title: 'Пользовательское соглашение | ChatAI PRO',
    description: 'Условия использования сервиса ChatAI PRO для доступа к GPT-4, Claude и другим ИИ-моделям.',
    keywords: 'пользовательское соглашение, условия использования, правила'
  }
];

function generateHTML(route) {
  return `<!doctype html>
<html lang="ru">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/x-icon" href="/favicon.ico" />
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${route.title}</title>
    <meta name="description" content="${route.description}" />
    <meta name="keywords" content="${route.keywords}" />
    
    <!-- Open Graph -->
    <meta property="og:title" content="${route.title}" />
    <meta property="og:description" content="${route.description}" />
    <meta property="og:url" content="https://aichat-pro.ru${route.path}" />
    <meta property="og:site_name" content="ChatAI PRO" />
    <meta property="og:locale" content="ru_RU" />
    <meta property="og:type" content="website" />
    
    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${route.title}" />
    <meta name="twitter:description" content="${route.description}" />
    
    <meta name="theme-color" content="#3B82F6" />
    
    <script type="module" src="/src/main.tsx"></script>
  </head>
  <body>
    <div id="root">
      <!-- SEO Content for ${route.path} -->
      <noscript>
        <header>
          <h1>${route.title}</h1>
          <p>${route.description}</p>
        </header>
        <main>
          <p>ChatAI PRO - лучший способ общения с ИИ без VPN. Доступ к GPT-4, Claude, DeepSeek и другим передовым AI-моделям.</p>
        </main>
      </noscript>
    </div>
  </body>
</html>`;
}

async function prerenderSimple() {
  console.log('📄 Простой пререндеринг HTML страниц...');

  const buildDir = path.join(__dirname, '../build');
  
  if (!fs.existsSync(buildDir)) {
    console.log('❌ Директория build не найдена. Запустите npm run build сначала.');
    return;
  }

  for (const route of routes) {
    try {
      console.log(`📝 Создаем ${route.path}...`);

      // Создаем директорию для маршрута
      const routePath = route.path === '/' ? '/index' : route.path;
      const outputDir = path.join(buildDir, routePath);
      fs.mkdirSync(outputDir, { recursive: true });

      // Генерируем HTML
      const html = generateHTML(route);

      // Записываем HTML в файл
      fs.writeFileSync(path.join(outputDir, 'index.html'), html);
      console.log(`✅ ${route.path} готов`);
    } catch (error) {
      console.error(`❌ Ошибка создания ${route.path}:`, error.message);
    }
  }

  console.log('🎉 Простой пререндеринг завершен!');
}

prerenderSimple().catch(console.error);
