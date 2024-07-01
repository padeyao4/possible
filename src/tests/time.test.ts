import { getDaysBetweenDates } from '@/stores/timer'
import { test, expect } from 'vitest'

test('time', () => {
  const days = getDaysBetweenDates('2024/5/13 23:23', '2024/5/14 0:23')
  expect(days).toBe(-1)
})