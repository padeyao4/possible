import { test } from 'vitest'
import { convertToIndex } from '@/utils/time.js'

test('test timestamp util', () => {
  const date = new Date('2024-1-1')
  console.log(convertToIndex(date), convertToIndex(date.getTime()))
})