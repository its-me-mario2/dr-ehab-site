import { chromium } from 'playwright';
import { strict as assert } from 'assert';

const BASE = 'http://localhost:8080';

const USER = { name: 'Test User', phone: '01000000000', password: 'test123' };
const NEW_USER = { name: 'Test New', phone: '0122' + String(Date.now()).slice(-7), password: 'pass1234' };

let passed = 0, failed = 0;

async function test(name, fn) {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();
  try {
    await fn(page, context);
    console.log(`  PASS: ${name}`);
    passed++;
  } catch (e) {
    console.log(`  FAIL: ${name}`);
    console.log(`        ${e.message}`);
    failed++;
  } finally {
    await browser.close();
  }
}

async function login(page, phone, password) {
  await page.goto(BASE);
  await page.click('#authBtn');
  await page.waitForTimeout(300);
  await page.fill('#loginPhone', phone);
  await page.fill('#loginPassword', password);
  await page.click('#authLogin .btn-primary');
  await page.waitForTimeout(500);
}

// ── Tests ──

await test('page loads with correct title and key sections', async (page) => {
  await page.goto(BASE);
  const title = await page.title();
  assert(title.includes('Dr. Ehab El Zahed'), 'title mismatch');
  assert(await page.locator('.hero h1').first().isVisible());
  assert(await page.locator('#about').isVisible());
  assert(await page.locator('#specializations').isVisible());
  assert(await page.locator('#locations').isVisible());
  assert(await page.locator('#publications').isVisible());
  assert(await page.locator('#faq').isVisible());
});

await test('registration creates a new account', async (page) => {
  await page.goto(BASE);
  await page.click('#authBtn');
  await page.waitForTimeout(300);
  await page.click('.auth-tab[data-auth-tab="register"]');
  await page.fill('#regName', NEW_USER.name);
  await page.fill('#regPhone', NEW_USER.phone);
  await page.fill('#regPassword', NEW_USER.password);
  await page.click('#authRegister .btn-primary');
  await page.waitForTimeout(500);
  const successText = await page.locator('#registerSuccess.active').textContent();
  assert(successText.includes('Account created'), 'registration failed');
});

await test('login with existing user', async (page) => {
  await login(page, USER.phone, USER.password);
  assert(!await page.locator('#authModal').evaluate(el => el.classList.contains('active')),
    'auth modal still open');
  assert(await page.locator('#userBadge').isVisible(), 'user badge not visible');
});

await test('booking forces login for unauthenticated user', async (page) => {
  await page.goto(BASE);
  await page.locator('.btn-primary').filter({ hasText: 'Book an Appointment' }).first().click();
  await page.waitForTimeout(300);
  assert(await page.locator('#authModal').evaluate(el => el.classList.contains('active')));
  const subText = await page.locator('#authModal .modal-sub').textContent();
  assert(subText.includes('Please login'), 'expected login prompt');
});

await test('complete booking flow after login', async (page) => {
  await login(page, USER.phone, USER.password);
  await page.locator('.btn-primary').filter({ hasText: 'Book an Appointment' }).first().click();
  await page.waitForTimeout(400);
  assert(await page.locator('#bookingModal').evaluate(el => el.classList.contains('active')));
  // step 1: location - click next
  await page.click('#bookingNext1');
  await page.waitForTimeout(200);
  // verify name/phone auto-filled from user
  const name = await page.locator('#fullName').inputValue();
  assert(name === USER.name, `expected "${USER.name}", got "${name}"`);
  const phone = await page.locator('#phone').inputValue();
  assert(phone === USER.phone, `expected "${USER.phone}", got "${phone}"`);
  // step 2: next
  await page.click('#bookingNext2');
  await page.waitForTimeout(200);
  // step 3: select first available day
  const day = page.locator('.day:not(.disabled):not(.empty)').first();
  if (await day.isVisible()) {
    await day.click();
  }
  await page.click('#submitBtn');
  await page.waitForTimeout(1000);
  assert(await page.locator('#successScreen').isVisible(), 'success screen not visible');
  await page.click('#doneBtn');
});

await test('user dashboard shows appointment with cancel button', async (page) => {
  await login(page, USER.phone, USER.password);
  await page.click('#userBadge');
  await page.waitForTimeout(500);
  assert(await page.locator('#userDash').evaluate(el => el.classList.contains('active')));
  const cards = await page.locator('#userApptList .appointment-card').count();
  assert(cards > 0, 'expected at least one appointment');
  const cancelCount = await page.locator('#userApptList .appt-action-btn.cancel').count();
  assert(cancelCount > 0, 'expected cancel button');
});

await test('user can cancel own appointment', async (page) => {
  await login(page, USER.phone, USER.password);
  await page.click('#userBadge');
  await page.waitForTimeout(500);
  page.on('dialog', dialog => dialog.accept());
  const cancelBtn = page.locator('#userApptList .appt-action-btn.cancel').first();
  if (await cancelBtn.isVisible()) {
    await cancelBtn.click();
    await page.waitForTimeout(500);
    assert(await page.locator('#userApptList .status-cancelled').isVisible(),
      'expected cancelled status badge');
  }
});

await test('admin panel login and accept appointment', async (page) => {
  await page.goto(BASE);
  // Click the admin hint dot in the footer
  await page.click('#adminHint');
  await page.waitForTimeout(300);
  assert(await page.locator('#adminPanel').evaluate(el => el.classList.contains('active')));
  await page.fill('#adminPass', 'admin2026');
  await page.click('#adminLoginBtn');
  await page.waitForTimeout(300);
  assert(await page.locator('#adminDash').isVisible(), 'admin dash not visible');
  // go to pending tab and accept
  await page.click('[data-admin-tab="pending"]');
  await page.waitForTimeout(500);
  const pendingCards = await page.locator('#adminApptList .appointment-card').count();
  if (pendingCards > 0) {
    await page.locator('#adminApptList .appt-action-btn.accept').first().click();
    await page.waitForTimeout(500);
    assert(await page.locator('#adminApptList .status-accepted').isVisible(),
      'expected accepted status');
  }
});

// ── Summary ──
console.log(`\nResults: ${passed} passed, ${failed} failed out of ${passed + failed} tests`);
process.exit(failed > 0 ? 1 : 0);
