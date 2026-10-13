import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost:4000';

/**
 * Перед запуском каждого теста:
 * - заменить токены авторизации
 * - заменить ингредиенты HAR-файл
 * - заменить данные пользователя
 * - перейти на сайт
 */
test.beforeEach(async ({ page, context }) => {
  await context.addInitScript(() => {
    window.localStorage.setItem('accessToken', 'mock-access-token');
    window.localStorage.setItem('refreshToken', 'mock-refresh-token');
  });

  await page.routeFromHAR('tests/ingredients.har', {
    url: '**/api/ingredients',
    update: false,
  });

  await page.route('**/api/auth/user', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        user: { email: 'test@mail.ru', name: 'Пользователь' }
      }),
    });
  });

  await page.goto(BASE_URL);
});

// TODO: проверка, удалить
test.describe('Страница конструктора', () => {
  test('проверка доступа к странице', async ({ page }) => {
    await expect(page).toHaveURL(BASE_URL);
  });
});

test.describe('add ingredients to constructor works correctly', function () {

});
