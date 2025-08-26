// Тестовый скрипт для проверки системы PRO кредитов
// Запустите в браузере на странице http://localhost:3000

console.log('🧪 Тестирование системы PRO кредитов...');

// Функция для тестирования API
async function testProAPI() {
  try {
    // Получаем текущую сессию
    const { data: { session } } = await window.supabase.auth.getSession();
    
    if (!session) {
      console.log('❌ Нет активной сессии. Войдите в аккаунт.');
      return;
    }

    console.log('✅ Сессия найдена:', session.user.email);

    // Тестируем API PRO usage
    const response = await fetch('/api/pro/usage', {
      headers: {
        'Authorization': `Bearer ${session.access_token}`
      }
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ API PRO usage работает:', data);
    } else {
      const error = await response.text();
      console.log('❌ API PRO usage ошибка:', error);
    }

  } catch (error) {
    console.error('❌ Ошибка тестирования:', error);
  }
}

// Функция для проверки данных пользователя
async function checkUserData() {
  try {
    const { data: { user } } = await window.supabase.auth.getUser();
    
    if (!user) {
      console.log('❌ Пользователь не найден');
      return;
    }

    // Получаем данные пользователя из базы
    const { data: userData, error } = await window.supabase
      .from('users')
      .select('is_pro, pro_plan_type, pro_credits_remaining, pro_credits_total')
      .eq('id', user.id)
      .single();

    if (error) {
      console.log('❌ Ошибка получения данных пользователя:', error);
      return;
    }

    console.log('✅ Данные пользователя:', userData);

    if (userData.is_pro) {
      console.log('🎉 Пользователь имеет PRO статус!');
      console.log('📊 План:', userData.pro_plan_type);
      console.log('💳 Кредитов осталось:', userData.pro_credits_remaining);
      console.log('💳 Всего кредитов:', userData.pro_credits_total);
    } else {
      console.log('ℹ️ Пользователь на бесплатном плане');
    }

  } catch (error) {
    console.error('❌ Ошибка проверки данных:', error);
  }
}

// Функция для тестирования чата
async function testChatAPI() {
  try {
    const { data: { session } } = await window.supabase.auth.getSession();
    
    if (!session) {
      console.log('❌ Нет сессии для тестирования чата');
      return;
    }

    // Тестовое сообщение
    const testMessage = {
      messages: [
        {
          id: Date.now().toString(),
          role: 'user',
          content: 'Привет! Это тестовое сообщение для проверки системы кредитов.',
          timestamp: new Date().toISOString()
        }
      ],
      model: 'deepseek/deepseek-r1:free',
      chatId: 'test-chat-id'
    };

    console.log('📤 Отправляем тестовое сообщение...');

    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${session.access_token}`
      },
      body: JSON.stringify(testMessage)
    });

    if (response.ok) {
      console.log('✅ API чата работает');
      const data = await response.json();
      console.log('📥 Ответ:', data);
    } else {
      const error = await response.text();
      console.log('❌ API чата ошибка:', error);
    }

  } catch (error) {
    console.error('❌ Ошибка тестирования чата:', error);
  }
}

// Запускаем тесты
console.log('🚀 Запуск тестов...');

// Ждем немного для загрузки Supabase
setTimeout(async () => {
  await checkUserData();
  await testProAPI();
  await testChatAPI();
  
  console.log('✅ Тестирование завершено!');
  console.log('📋 Проверьте консоль для результатов');
}, 2000);

// Инструкции для пользователя
console.log(`
📋 Инструкции по тестированию:

1. 🔐 Войдите в аккаунт на http://localhost:3000
2. 🎯 Перейдите на страницу /upgrade
3. 💳 Активируйте PRO подписку (тестовый платеж)
4. 💬 Отправьте несколько сообщений в чате
5. 📊 Проверьте статистику в профиле
6. 🧪 Запустите этот скрипт в консоли браузера

Результаты тестов появятся в консоли выше.
`);
