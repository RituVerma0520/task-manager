import { expect, test, type Page } from '@playwright/test'

async function counts(page: Page, total: number, pending: number, completed: number) {
  await expect(page.getByRole('term')).toHaveText(['Total', 'Pending', 'Completed'])
  await expect(page.getByRole('definition')).toHaveText([total, pending, completed].map(String))
}

test.beforeEach(async ({ page }) => {
  await page.goto('/')
  await expect(page.getByRole('status')).toHaveText('No tasks yet. Add your first task above.')
  await counts(page, 0, 0, 0)
})

test('validates names, trims on submit, and resets on refresh', async ({ page }) => {
  const input = page.getByLabel('New task')
  for (const value of ['', '   ']) {
    await input.fill(value)
    await page.getByRole('button', { name: 'Add task' }).click()
    await expect(input).toBeFocused()
    await expect(input).toHaveAccessibleDescription('Enter a task name.')
    await expect(page.getByRole('alert')).toBeVisible()
    await expect(page.getByRole('listitem')).toHaveCount(0)
    await counts(page, 0, 0, 0)
  }
  await input.fill('  Review notes  ')
  await input.press('Enter')
  await expect(page.getByRole('listitem')).toHaveCount(1)
  await expect(page.getByText('Review notes', { exact: true })).toHaveJSProperty('textContent', 'Review notes')
  await expect(page.getByRole('checkbox')).not.toBeChecked()
  await expect(input).toHaveValue('')
  await expect(page.getByRole('alert')).toHaveCount(0)
  await counts(page, 1, 1, 0)
  await page.reload()
  await expect(page.getByRole('checkbox')).toHaveCount(0)
  await counts(page, 0, 0, 0)
})

test('duplicate tasks toggle and delete independently across filters', async ({ page }) => {
  const boxes = page.getByRole('checkbox', { name: 'Review', exact: true })
  const button = (name: string) => page.getByRole('button', { name, exact: true })
  async function filter(name: string) {
    await button(name).click()
    await expect(button(name)).toHaveAttribute('aria-pressed', 'true')
  }
  for (const n of [1, 2]) {
    await page.getByLabel('New task').fill('Review')
    await button('Add task').click()
    await expect(boxes).toHaveCount(n)
    await counts(page, n, n, 0)
  }
  await filter('Completed')
  await expect(page.getByRole('status')).toHaveText('No completed tasks.')
  await counts(page, 2, 2, 0)
  await filter('Pending')
  await expect(boxes).toHaveCount(2)
  await counts(page, 2, 2, 0)
  await expect(boxes.first()).not.toBeChecked()
  await boxes.first().click()
  await expect(boxes).toHaveCount(1)
  await expect(boxes).not.toBeChecked()
  await expect(button('Pending')).toHaveAttribute('aria-pressed', 'true')
  await counts(page, 2, 1, 1)
  await filter('All')
  await expect(boxes).toHaveCount(2)
  await expect(boxes.first()).toBeChecked()
  await expect(boxes.last()).not.toBeChecked()
  await counts(page, 2, 1, 1)
  await filter('Completed')
  await expect(boxes).toHaveCount(1)
  await expect(boxes).toBeChecked()
  await counts(page, 2, 1, 1)
  await boxes.click()
  await expect(page.getByRole('status')).toHaveText('No completed tasks.')
  await counts(page, 2, 2, 0)
  await filter('All')
  await expect(boxes).toHaveCount(2)
  await expect(boxes.first()).not.toBeChecked()
  await expect(boxes.last()).not.toBeChecked()
  await counts(page, 2, 2, 0)
  await boxes.last().check()
  await counts(page, 2, 1, 1)
  await button('Delete Review').first().click()
  await expect(boxes).toHaveCount(1)
  await expect(boxes).toBeChecked()
  await counts(page, 1, 0, 1)
  await filter('Pending')
  await expect(page.getByRole('status')).toHaveText('No pending tasks.')
  await counts(page, 1, 0, 1)
  await filter('Completed')
  await counts(page, 1, 0, 1)
  await button('Delete Review').click()
  await expect(page.getByRole('status')).toHaveText('No tasks yet. Add your first task above.')
  await expect(boxes).toHaveCount(0)
  await counts(page, 0, 0, 0)
})

test('keyboard controls and long names fit the viewport', async ({ page }) => {
  const input = page.getByLabel('New task')
  const longName = 'x'.repeat(240)
  await page.keyboard.press('Tab')
  await expect(input).toBeFocused()
  await input.fill(longName)
  const add = page.getByRole('button', { name: 'Add task' })
  await page.keyboard.press('Tab')
  await expect(add).toBeFocused()
  await page.keyboard.press('Enter')
  await counts(page, 1, 1, 0)
  const box = page.getByRole('checkbox', { name: longName })
  await expect(box).toBeInViewport()
  expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(page.viewportSize()!.width)
  for (const name of ['Add task', 'All', 'Pending', 'Completed']) {
    await page.keyboard.press('Tab')
    const control = page.getByRole('button', { name, exact: true })
    await expect(control).toBeFocused()
    await expect(control).toHaveCSS('outline-style', 'solid')
    if (name === 'All') await page.keyboard.press('Enter')
  }
  await page.keyboard.press('Tab')
  await expect(box).toBeFocused()
  await page.keyboard.press('Space')
  await expect(box).toBeChecked()
  await counts(page, 1, 0, 1)
  await page.keyboard.press('Tab')
  await expect(page.getByRole('button', { name: 'Delete ' + longName })).toBeFocused()
  await page.keyboard.press('Enter')
  await expect(box).toHaveCount(0)
  await counts(page, 0, 0, 0)
})

async function addThree(page: Page) {
  const input = page.getByLabel('New task')
  for (const name of ['First', 'Middle', 'Last']) {
    await input.fill(name)
    await input.press('Enter')
  }
}

async function visibleNames(page: Page, names: string[]) {
  const boxes = page.getByRole('checkbox')
  await expect(boxes).toHaveCount(names.length)
  for (const [index, name] of names.entries()) {
    await expect(boxes.nth(index)).toHaveAccessibleName(name)
  }
}

async function activeFilter(page: Page, name: string) {
  const active = page.getByRole('group', { name: 'Filter tasks' }).getByRole('button', { pressed: true })
  await expect(active).toHaveCount(1)
  await expect(active).toHaveAccessibleName(name)
}

test('keyboard deletion follows visible rows and returns to the filter', async ({ page }) => {
  await addThree(page)
  await page.getByRole('button', { name: 'Delete Middle' }).press('Enter')
  for (const [index, names] of [['First', 'Last'], ['First'], []].entries()) {
    await visibleNames(page, names)
    await counts(page, names.length, names.length, 0)
    await activeFilter(page, 'All')
    const target = ['Delete Last', 'Delete First', 'All'][index]
    await expect(page.getByRole('button', { name: target, exact: true })).toBeFocused()
    if (names.length) await page.keyboard.press('Enter')
  }
})

test('keyboard toggles retain or restore focus across filters', async ({ page }) => {
  await addThree(page)
  const first = page.getByRole('checkbox', { name: 'First' })
  await first.press('Space')
  await expect(first).toBeFocused()
  await expect(first).toBeChecked()
  await visibleNames(page, ['First', 'Middle', 'Last'])
  await counts(page, 3, 2, 1)
  await activeFilter(page, 'All')
  const pending = page.getByRole('button', { name: 'Pending', exact: true })
  await pending.press('Enter')
  await activeFilter(page, 'Pending')
  await visibleNames(page, ['Middle', 'Last'])
  await counts(page, 3, 2, 1)
  await page.getByRole('checkbox', { name: 'Middle' }).press('Space')
  await visibleNames(page, ['Last'])
  await counts(page, 3, 1, 2)
  await expect(page.getByRole('checkbox', { name: 'Last' })).toBeFocused()
  await page.keyboard.press('Space')
  await visibleNames(page, [])
  await counts(page, 3, 0, 3)
  await expect(pending).toBeFocused()
  await page.keyboard.press('Tab')
  await page.keyboard.press('Enter')
  await activeFilter(page, 'Completed')
  await visibleNames(page, ['First', 'Middle', 'Last'])
  await counts(page, 3, 0, 3)
  await page.getByRole('checkbox', { name: 'Last' }).press('Space')
  await expect(page.getByRole('checkbox', { name: 'Middle' })).toBeFocused()
  await visibleNames(page, ['First', 'Middle'])
  await counts(page, 3, 1, 2)
})

test('unfocused task actions leave focus at the input', async ({ page }) => {
  await addThree(page)
  const input = page.getByLabel('New task')
  await page.getByRole('button', { name: 'Pending', exact: true }).click()
  await input.focus()
  await page.getByRole('checkbox', { name: 'First' }).dispatchEvent('click')
  await expect(input).toBeFocused()
  await visibleNames(page, ['Middle', 'Last'])
  await counts(page, 3, 2, 1)
  await page.getByRole('button', { name: 'Delete Last' }).dispatchEvent('click')
  await expect(input).toBeFocused()
  await visibleNames(page, ['Middle'])
  await counts(page, 2, 1, 1)
})
