import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer } from 'vite';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const routes = [
  '/',
  '/login',
  '/register',
  '/gpt-bez-vpn',
  '/blog',
  '/privacy',
  '/terms'
];

async function prerenderForDocker() {
  console.log('🐳 Запуск пререндеринга для Docker...');

  // Запускаем временный сервер для пререндеринга
  const server = await createServer({
    configFile: path.join(__dirname, '../vite.config.ts'),
    root: path.join(__dirname, '..'),
    server: { middlewareMode: true }
  });

  const app = server.middlewares;
  const httpServer = require('http').createServer(app);
  
  await new Promise((resolve) => {
    httpServer.listen(4173, resolve);
  });

  console.log('🌐 Временный сервер запущен на порту 4173');

  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor',
      '--single-process',
      '--no-zygote'
    ]
  });

  const page = await browser.newPage();

  // Отключаем изображения для скорости
  await page.setRequestInterception(true);
  page.on('request', (request) => {
    if (['image', 'font'].indexOf(request.resourceType()) !== -1) {
      request.abort();
    } else {
      request.continue();
    }
  });

  for (const route of routes) {
    try {
      console.log(`📄 Рендерим ${route}...`);

      const url = `http://localhost:4173${route}`;
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 10000 });

      // Ждем полной загрузки React
      await page.waitForSelector('#root', { timeout: 5000 });
      await new Promise(resolve => setTimeout(resolve, 2000));

      const html = await page.content();

      // Создаем директорию для маршрута
      const routePath = route === '/' ? '/index' : route;
      const outputDir = path.join(__dirname, '../build', routePath);
      fs.mkdirSync(outputDir, { recursive: true });

      // Записываем HTML в файл
      fs.writeFileSync(path.join(outputDir, 'index.html'), html);
      console.log(`✅ ${route} готов`);
    } catch (error) {
      console.error(`❌ Ошибка рендеринга ${route}:`, error.message);
    }
  }

  await browser.close();
  httpServer.close();
  await server.close();
  
  console.log('🎉 Пререндеринг для Docker завершен!');
}

prerenderForDocker().catch(console.error);
