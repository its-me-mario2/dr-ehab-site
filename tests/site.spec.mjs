import { test, expect } from 'playwright/test';

const BASE = 'http://localhost:8080';

const TEST_USER = {
  name: 'Playwright Test',
  phone: '01111111111',
  password: 'testpass'
};

test.describe('Dr. Ehab El Zahed Site', () => {

  test('page loads with correct title and key sections', async ({ page }) => {
    await page.goto(BASE);
    await expect(page).toHaveTitle(/Dr\. Ehab El Zahed/);
    await expect(page.locator('.hero h1')).toContainText('Orthopedic Care');
    await expect(page.locator('.stats-strip')).toBeVisible();
    await expect(page.locator('#about')).toBeVisible();
    await expect(page.locator('#specializations')).toBeVisible();
    await expect(page.locator('#locations')).toBeVisible();
    await expect(page.locator('#publications')).toBeVisible();
    await expect(page.locator('#faq')).toBeVisible();
  });

  test('registration creates a new account', async ({ page }) => {
    await page.goto(BASE);
    await page.click('#authBtn');
    await expect(page.locator('#authModal')).toHaveClass(/active/);
    await page.click('.auth-tab[data-auth-tab="register"]');
    await page.fill('#regName', TEST_USER.name);
    await page.fill('#regPhone', TEST_USER.phone);
    await page.fill('#regPassword', TEST_USER.password);
    await page.click('button:has-text("Register")');
    await expect(page.locator('#registerSuccess')).toBeVisible();
  });

  test('login with registered user', async ({ page }) => {
    await page.goto(BASE);
    await page.click('#authBtn');
    await page.fill('#loginPhone', TEST_USER.phone);
    await page.fill('#loginPassword', TEST_USER.password);
    await page.click('button:has-text("Login")');
    await expect(page.locator('#authModal')).not.toHaveClass(/active/);
    await expect(page.locator('#authBtn')).not.toBeVisible();
    await expect(page.locator('#userBadge')).toBeVisible();
  });

  test('booking forces login then proceeds', async ({ page }) => {
    await page.goto(BASE);
    await page.click('.btn-primary:has-text("Book an Appointment")');
    await expect(page.locator('#authModal')).toHaveClass(/active/);
    await expect(page.locator('#authModal .modal-sub')).toContainText('Please login');
    await page.fill('#loginPhone', TEST_USER.phone);
    await page.fill('#loginPassword', TEST_USER.password);
    await page.click('button:has-text("Login")');
    await expect(page.locator('#authModal')).not.toHaveClass(/active/);
    await expect(page.locator('#bookingModal')).toHaveClass(/active/);
  });

  test('complete booking flow', async ({ page }) => {
    await page.goto(BASE);
    await page.click('#authBtn');
    await page.fill('#loginPhone', TEST_USER.phone);
    await page.fill('#loginPassword', TEST_USER.password);
    await page.click('button:has-text("Login")');
    await page.click('.btn-primary:has-text("Book an Appointment")');
    await expect(page.locator('#bookingModal')).toHaveClass(/active/);
    await expect(page.locator('.step.active[data-step="1"]')).toBeVisible();
    await page.click('#bookingNext1');
    await expect(page.locator('.step.active[data-step="2"]')).toBeVisible();
    await expect(page.locator('#fullName')).toHaveValue(TEST_USER.name);
    await expect(page.locator('#phone')).toHaveValue(TEST_USER.phone);
    await page.click('#bookingNext2');
    await expect(page.locator('.step.active[data-step="3"]')).toBeVisible();
    await page.click('.day:not(.disabled):not(.empty):not(.day-name)');
    await page.click('#submitBtn');
    await expect(page.locator('#spinner')).not.toHaveClass(/active/);
    await expect(page.locator('#successScreen')).toBeVisible();
    await expect(page.locator('#successScreen h3')).toContainText('Appointment Request');
    await page.click('#doneBtn');
    await expect(page.locator('#bookingModal')).not.toHaveClass(/active/);
  });

  test('user dashboard shows appointments with cancel option', async ({ page }) => {
    await page.goto(BASE);
    await page.click('#authBtn');
    await page.fill('#loginPhone', TEST_USER.phone);
    await page.fill('#loginPassword', TEST_USER.password);
    await page.click('button:has-text("Login")');
    await page.click('#userBadge');
    await expect(page.locator('#userDash')).toHaveClass(/active/);
    await expect(page.locator('#userApptList .appointment-card')).toHaveCount(1);
    await expect(page.locator('#userApptList .appt-action-btn.cancel')).toBeVisible();
  });

  test('user can cancel their own appointment', async ({ page }) => {
    await page.goto(BASE);
    await page.click('#authBtn');
    await page.fill('#loginPhone', TEST_USER.phone);
    await page.fill('#loginPassword', TEST_USER.password);
    await page.click('button:has-text("Login")');
    await page.click('#userBadge');
    page.on('dialog', dialog => dialog.accept());
    await page.click('#userApptList .appt-action-btn.cancel');
    await expect(page.locator('#userApptList .status-cancelled')).toBeVisible();
  });

  test('admin panel login and accept appointment with time slot', async ({ page }) => {
    await page.goto(BASE);
    await page.evaluate(() => {
      window.dispatchEvent(new KeyboardEvent('keydown', { key: 'A', ctrlKey: true, shiftKey: true }));
    });
    await expect(page.locator('#adminPanel')).toHaveClass(/active/);
    await expect(page.locator('#adminLogin')).toBeVisible();
    await page.fill('#adminPass', 'admin2026');
    await page.click('#adminLoginBtn');
    await expect(page.locator('#adminDash')).toBeVisible();
    await page.click('[data-admin-tab="all"]');
    await expect(page.locator('#adminApptList .appointment-card')).toHaveCount(1);
    await page.click('[data-admin-tab="pending"]');
    await page.click('#adminApptList .appt-action-btn.accept');
    await page.waitForTimeout(500);
    await expect(page.locator('#adminApptList .status-accepted')).toBeVisible();
  });

});
