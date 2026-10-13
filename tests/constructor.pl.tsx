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

  test('добавление булки в конструктор', async ({ page }) => {
    await page.locator('*:has-text("Тестовая Булка 1")').getByRole('button').first().click();

    await expect(page.getByText('Тестовая Булка 1').last()).toBeVisible()
  });

  test('открытие и закрытие по крестику модального окна ингредиента', async ({ page }) => {
    await page.getByText('Тестовая Булка 1').first().click();

    await expect(page.locator('[class*="modal__modal"]').first()).toBeVisible();

    await page.getByRole('button', { name: 'Закрыть' }).locator('svg').click();

    await expect(page.locator('[class*="modal__modal"]')).not.toBeVisible();
  });

  test('оформление заказа', async ({ page }) => {
    await page.route('**/api/orders', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          name: 'Space Burger',
          order: { number: 10 }
        }),
      });
    });

    await page.locator('*:has-text("Тестовая Булка 1")').getByRole('button', { name: 'Добавить' }).first().click();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    await expect(page.getByText('12345')).toBeVisible();
  });
});

test.describe('add ingredients to constructor works correctly', function () {

});
