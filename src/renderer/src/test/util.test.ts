import { viTest } from 'src/renderer/src/util'
import { expect, test } from 'vitest'

test('run vitest', () => {
  expect(viTest()).toBe(1)
})
