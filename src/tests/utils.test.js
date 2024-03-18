import { test } from 'vitest'
import { convertToIndex } from '@/utils/time.js'

test('test timestamp util', () => {
  const date = new Date('2024-1-1')
  console.log(convertToIndex(date), convertToIndex(date.getTime()))
})

test('test typeof', () => {
  const a = +'1' + 3
  console.log(a)
})

test('proxy', () => {
  const aoo = {
    name: 'hello',
    age: 18,
    cars: ['a', 'b']
  }

  const proxy = new Proxy(aoo, {
    get: (target, p) => {
      return Reflect.get(target, p)
    },
    set(target, p, newValue, receiver) {
      console.log('set', p, newValue, receiver)
      return Reflect.set(target, p, newValue, receiver)
    },
    apply(target, thisArg, argumentsList) {
      console.log('apply', thisArg, argumentsList)
      return Reflect.apply(target, thisArg, argumentsList)
    }
  })

  console.log(proxy.age)
  console.log(proxy.cars[0])
  proxy.name = 'world'
  proxy.cars.push('c')
})