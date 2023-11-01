import { viTest } from 'src/renderer/src/util'
// import { SegmentManage } from 'src/renderer/src/util/linkedNode'
import { expect, test } from 'vitest'

test('run vitest', () => {
  expect(viTest()).toBe(1)
})

test('segment manage', () => {
  // const sm = new SegmentManage()
})
