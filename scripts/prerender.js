import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const routes = [
  '/',
  '/login',
  '/register', 
  '/chat',
  '/upgrade',
  '/gpt-bez-vpn',
  '/blog',
  '/privacy',
  '/terms',
  '/settings',
  '/profile'
];

async function prerender() {
  console.log('🚀 Запуск пререндеринга...');
  
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-dev-shm-usage',
      '--disable-gpu',
      '--no-first-run',
      '--disable-web-security',
      '--disable-features=VizDisplayCompositor',
      '--single-process',
      '--no-zygote'
    ]
  });

  const page = await browser.newPage();
  
  // Отключаем изображения и внешние ресурсы для скорости
  await page.setRequestInterception(true);
  page.on('request', (req) => {
    if (req.resourceType() === 'image' || req.resourceType() === 'font') {
      req.abort();
    } else {
      req.continue();
    }
  });

  for (const route of routes) {
    try {
      console.log(`📄 Рендерим ${route}...`);
      
      const url = `http://localhost:4173${route}`;
      await page.goto(url, { waitUntil: 'networkidle0', timeout: 15000 });
      
      // Ждем пока React отрендерит контент
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const html = await page.content();
      
      // Создаем директорию для маршрута
      const routePath = route === '/' ? '/index' : route;
      const dir = path.join(__dirname, '..', 'build', routePath);
      
      if (route !== '/') {
        fs.mkdirSync(dir, { recursive: true });
        fs.writeFileSync(path.join(dir, 'index.html'), html);
      } else {
        fs.writeFileSync(path.join(__dirname, '..', 'build', 'index.html'), html);
      }
      
      console.log(`✅ ${route} готов`);
    } catch (error) {
      console.error(`❌ Ошибка рендеринга ${route}:`, error.message);
    }
  }

  await browser.close();
  console.log('🎉 Пререндеринг завершен!');
}

prerender().catch(console.error);
