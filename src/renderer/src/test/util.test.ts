import { viTest } from 'src/renderer/src/util'
import { expect, test } from 'vitest'
import moment from 'moment'

test('run vitest', () => {
  expect(viTest()).toBe(1)
})

test('segment manage', () => {
  // const sm = new SegmentManage()
})

test('moment', () => {
  const d = moment('20030101').startOf('day').fromNow()
  console.log(d)
})

test('json', () => {
  const a = { hello: 123, world: 'xxx' }
  const s = JSON.stringify(a)
  console.log(s)
})
