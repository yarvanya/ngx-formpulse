import type {Page} from '@playwright/test';
import {expect, test} from '../fixtures/sandbox-test';

const ENGLISH_MESSAGE = 'This field is required.';
const UKRAINIAN_MESSAGE = 'Це поле обов’язкове.';
const MESSAGE_TABLE_ROW_COUNT = 8;
const FORM_SYSTEMS = ['Reactive Forms', 'Signal Forms'];

async function openTab(page: Page, tab_name: string): Promise<void> {
  await page.getByRole('tab', {name: tab_name}).click();
  await expect(page.getByRole('tab', {name: tab_name})).toHaveAttribute('aria-selected', 'true');
}

function nameField(page: Page, form_system: string) {
  return page.getByRole('textbox', {name: `Name (${form_system})`});
}

function quantityField(page: Page, form_system: string) {
  return page.getByRole('spinbutton', {name: `Quantity (${form_system})`});
}

function newsletterCheckbox(page: Page, form_system: string) {
  return page.getByRole('checkbox', {name: `Subscribe to the newsletter (${form_system})`});
}

test.describe('fpRequired page', () => {
  test.beforeEach(async ({openPage}) => {
    await openPage('/validators/required');
  });

  test('is reachable from the navigation', async ({page, openPage}) => {
    await openPage('/');
    await page.getByRole('navigation', {name: 'Main'}).getByRole('link', {name: 'fpRequired'}).click();
    await expect(page).toHaveTitle('fpRequired | FormPulse');
    await expect(page.getByRole('heading', {level: 1, name: 'fpRequired'})).toBeVisible();
  });

  test('documents the rules, the comparison and the messages', async ({page}) => {
    await openTab(page, 'API');
    await expect(page.getByRole('table', {name: 'FpRequiredOptions'})).toContainText('message');
    await expect(page.getByRole('table', {name: 'Required rules compared'})).toContainText('React Hook Form');
    const messagesTable = page.getByRole('table', {name: 'Built-in fpRequired messages'});
    await expect(messagesTable.getByRole('row')).toHaveCount(MESSAGE_TABLE_ROW_COUNT);
    await expect(messagesTable).toContainText(UKRAINIAN_MESSAGE);
  });

  test.describe('Examples', () => {
    test.beforeEach(async ({page}) => {
      await openTab(page, 'Examples');
    });

    test('rejects text of spaces only and accepts text', async ({page}) => {
      for (const formSystem of FORM_SYSTEMS) {
        await nameField(page, formSystem).fill('   ');
        await expect(nameField(page, formSystem)).toHaveAccessibleDescription(ENGLISH_MESSAGE);
        await nameField(page, formSystem).fill('Ivan');
        await expect(nameField(page, formSystem)).toHaveAttribute('aria-invalid', 'false');
      }
    });

    test('accepts zero as a quantity', async ({page}) => {
      for (const formSystem of FORM_SYSTEMS) {
        await quantityField(page, formSystem).fill('0');
        await expect(quantityField(page, formSystem)).toHaveAttribute('aria-invalid', 'false');
      }
    });

    test('marks the Signal Forms field as required', async ({page}) => {
      await expect(nameField(page, 'Signal Forms')).toHaveAttribute('required', '');
      await expect(nameField(page, 'Signal Forms')).toHaveAttribute('aria-required', 'true');
    });

    test('accepts an unchecked checkbox and rejects an untouched one', async ({page}) => {
      for (const formSystem of FORM_SYSTEMS) {
        await newsletterCheckbox(page, formSystem).click();
        await newsletterCheckbox(page, formSystem).click();
        await expect(newsletterCheckbox(page, formSystem)).not.toBeChecked();
        await expect(newsletterCheckbox(page, formSystem)).toHaveAccessibleDescription('');
      }
      await page.getByRole('button', {name: 'Reset checkboxes to untouched'}).click();
      await page.getByRole('button', {name: 'Apply case: null'}).click();
      await expect(page.getByText('Applied value: null')).toBeVisible();
      await expect(page.getByText('has errors')).toHaveCount(FORM_SYSTEMS.length);
    });

    test('rejects an empty selection', async ({page}) => {
      const languagesField = page.getByRole('combobox', {name: 'Languages (Signal Forms)'});
      await languagesField.focus();
      await languagesField.press('Enter');
      await page.getByRole('option', {name: 'Polish'}).click();
      await page.getByRole('option', {name: 'Polish'}).click();
      await page.keyboard.press('Escape');
      await expect(languagesField).toHaveAccessibleDescription(ENGLISH_MESSAGE);
    });

    test('shows the message in the selected language', async ({page}) => {
      await page.getByRole('combobox', {name: 'Message language'}).click();
      await page.getByRole('option', {name: 'Ukrainian', exact: true}).click();
      await nameField(page, 'Reactive Forms').fill('   ');
      await expect(nameField(page, 'Reactive Forms')).toHaveAccessibleDescription(UKRAINIAN_MESSAGE);
      await expect(page.getByRole('figure').filter({hasText: 'Signal Forms'})).toContainText('fpRequired(path.name, {locale: FpLocale.Uk})');
    });

    test('applies a case that cannot be typed', async ({page}) => {
      await page.getByRole('button', {name: 'Apply case: empty Map'}).click();
      await expect(page.getByText('Applied value: new Map()')).toBeVisible();
      await expect(page.getByText('has errors')).toHaveCount(FORM_SYSTEMS.length);
      await page.getByRole('button', {name: 'Apply case: zero as a big integer'}).click();
      await expect(page.getByText('no errors')).toHaveCount(FORM_SYSTEMS.length);
    });

    test('copies a code example', async ({page, context}) => {
      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
      await page.getByRole('button', {name: 'Copy Reactive Forms code'}).click();
      await expect(page.getByRole('button', {name: 'Copied Reactive Forms code'})).toBeVisible();
      const copiedText = await page.evaluate(async () => navigator.clipboard.readText());
      expect(copiedText).toContain('fpRequired()');
    });

    test('shows a validity icon with a tooltip', async ({page}) => {
      const nameFormField = page.locator('mat-form-field').filter({has: nameField(page, 'Reactive Forms')});
      await nameFormField.getByRole('img', {name: 'Validity: invalid'}).hover();
      await expect(page.locator('.mat-mdc-tooltip')).toHaveText('Invalid');
      await nameField(page, 'Reactive Forms').fill('Ivan');
      await expect(nameFormField.getByRole('img', {name: 'Validity: valid'})).toBeVisible();
      const newsletterField = page.locator('.checkbox-field').filter({has: newsletterCheckbox(page, 'Signal Forms')});
      await expect(newsletterField.getByRole('img', {name: 'Validity: invalid'})).toBeVisible();
      await newsletterCheckbox(page, 'Signal Forms').click();
      await expect(newsletterField.getByRole('img', {name: 'Validity: valid'})).toBeVisible();
    });

    test('has no accessibility violations', async ({page, expectNoAccessibilityViolations}) => {
      await nameField(page, 'Reactive Forms').fill('   ');
      await nameField(page, 'Signal Forms').fill('   ');
      await expectNoAccessibilityViolations();
    });
  });

  test('has no accessibility violations on the Description and API tabs', async ({page, expectNoAccessibilityViolations}) => {
    await expectNoAccessibilityViolations();
    await openTab(page, 'API');
    await expectNoAccessibilityViolations();
  });
});
