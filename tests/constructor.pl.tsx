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
    window.localStorage.setItem('refreshToken', 'mock-refresh-token');
  });

  await context.addCookies([
    {
      name: 'accessToken',
      value: 'mock-access-token',
      url: BASE_URL,
    },
  ]);

  await page.routeFromHAR('tests/hars/ingredients.har', {
    url: '**/api/ingredients',
    update: false,
  });

  await page.routeFromHAR('tests/hars/user.har', {
    url: '**/api/auth/user',
    update: false,
  });

  await page.routeFromHAR('tests/hars/order.har', {
    url: '**/api/orders',
    update: false,
  });

  await page.goto(BASE_URL);
});

test.describe('Страница конструктора', () => {
  test('добавление булки и ингредиента в конструктор', async ({ page }) => {
    await page
      .locator('li[class*="container"]')
      .filter({ hasText: 'Краторная булка N-200i' })
      .getByRole('button')
      .first()
      .click();

    const constructor = page.getByTestId('constructor');
    await expect(constructor.getByText('Краторная булка N-200i (верх)')).toBeVisible();

    const sauce = page
      .locator('li[class*="container"]')
      .filter({ hasText: 'Соус Spicy-X' })
      .first();
    await sauce.scrollIntoViewIfNeeded();

    await page
      .locator('li[class*="container"]')
      .filter({ hasText: 'Соус Spicy-X' })
      .getByRole('button', { name: 'Добавить' })
      .first()
      .click();

    await expect(constructor.getByText('Краторная булка N-200i (верх)')).toBeVisible();
    await expect(constructor.getByText('Соус Spicy-X')).toBeVisible();
  });

  test('открытие и закрытие модального окна ингредиента', async ({ page }) => {
    const bun = page
      .locator('li[class*="container"]')
      .filter({ hasText: 'Краторная булка N-200i' });
    await bun.getByText('Краторная булка N-200i').first().click();

    const modal = page.locator('[class*="modal__modal"]').first();
    await expect(modal).toBeVisible();

    await expect(modal.getByText('Краторная булка N-200i')).toBeVisible();

    await page.getByRole('button', { name: 'Закрыть' }).locator('svg').click();

    await expect(modal).not.toBeVisible();

    const sauce = page
      .locator('li[class*="container"]')
      .filter({ hasText: 'Соус Spicy-X' });
    await sauce.getByText('Соус Spicy-X').first().click();

    await expect(modal).toBeVisible();

    await expect(modal.getByText('Соус Spicy-X')).toBeVisible();

    await page
      .getByTestId('modal-overlay')
      .click({ position: { x: 5, y: 5 }, force: true });

    await expect(modal).not.toBeVisible();
  });

  test('оформление заказа с последующим закрытием модального окна и очисткой конструктора', async ({
    page,
  }) => {
    await page
      .locator('li[class*="container"]')
      .filter({ hasText: 'Краторная булка N-200i' })
      .getByRole('button')
      .first()
      .click();

    const sauce = page
      .locator('li[class*="container"]')
      .filter({ hasText: 'Соус Spicy-X' })
      .first();
    await sauce.scrollIntoViewIfNeeded();
    await page
      .locator('li[class*="container"]')
      .filter({ hasText: 'Соус Spicy-X' })
      .getByRole('button', { name: 'Добавить' })
      .first()
      .click();

    await page.getByRole('button', { name: 'Оформить заказ' }).click();

    await expect(page.getByTestId('order-number')).toHaveText('111');

    const constructorZone = page.getByTestId('constructor');
    await expect(constructorZone.getByText('Выберите булки').first()).toBeVisible();
    await expect(constructorZone.getByText('Выберите начинку').first()).toBeVisible();
    await expect(constructorZone.getByText('Краторная булка N-200i (верх)')).not.toBeVisible();
    await expect(constructorZone.getByText('Соус Spicy-X')).not.toBeVisible();

    await page.getByRole('button', { name: 'Закрыть' }).locator('svg').click();

    await expect(page.locator('[class*="modal__modal"]')).not.toBeVisible();

    await expect(page.getByText('Выберите булки').first()).toBeVisible();
  });
});