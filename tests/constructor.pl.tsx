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

test.describe('Страница конструктора', () => {
  test('добавление булки и ингредиента в конструктор', async ({ page }) => {
    await page.locator('*:has-text("Тестовая Булка 1")').getByRole('button').first().click();

    await expect(page.getByText('Тестовая Булка 1').last()).toBeVisible();

    const sauce = page.locator('*:has-text("Тестовый Соус 1")').first();
    await sauce.scrollIntoViewIfNeeded();

    await page.locator('*:has-text("Тестовый Соус 1")').getByRole('button', { name: 'Добавить' }).first().click();

    await expect(page.getByText('Тестовая Булка 1').last()).toBeVisible();
    await expect(page.getByText('Тестовый Соус 1').last()).toBeVisible();
  });

  test('открытие и закрытие модального окна ингредиента', async ({ page }) => {
    await page.getByText('Тестовая Булка 1').first().click();

    await expect(page.locator('[class*="modal__modal"]').first()).toBeVisible();

    await page.getByRole('button', { name: 'Закрыть' }).locator('svg').click();

    await expect(page.locator('[class*="modal__modal"]')).not.toBeVisible();

    await page.getByText('Тестовая Булка 1').first().click();

    await expect(page.locator('[class*="modal__modal"]')).toBeVisible();

    await page.getByTestId('modal-overlay').click({ position: { x: 5, y: 5 }, force: true });

    await expect(page.locator('[class*="modal__modal"]')).not.toBeVisible();
  });

  test('оформление заказа с последующим закрытием модального окна и очисткой конструктора', async ({ page }) => {
    await page.route('**/api/orders', async (route) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          name: 'Space Burger',
          order: { number: 111 }
        }),
      });
    });

    await page.locator('*:has-text("Тестовая Булка 1")').getByRole('button', { name: 'Добавить' }).first().click();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    await expect(page.getByText('111')).toBeVisible();

    await page.getByRole('button', { name: 'Закрыть' }).locator('svg').click();

    await expect(page.locator('[class*="modal__modal"]')).not.toBeVisible();

    await expect(page.getByText('Выберите булки').first()).toBeVisible();
  });
});
