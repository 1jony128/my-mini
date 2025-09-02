import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

// Копируем статические файлы в корень build директории
const staticFiles = ['sitemap.xml', 'robots.txt']

staticFiles.forEach(file => {
  const sourcePath = path.join(__dirname, '../public', file)
  const targetPath = path.join(__dirname, '../build', file)
  
  try {
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, targetPath)
      console.log(`✅ Скопирован ${file}`)
    }
  } catch (error) {
    console.error(`❌ Ошибка копирования ${file}:`, error)
  }
})

console.log('📁 Статические файлы скопированы в build/')
