import { test } from 'vitest'
import { convertToIndex } from '@/utils/time.js'
import { isRef, ref, shallowRef } from 'vue'

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

test('assign', () => {
  const a = {
    name: 'hello'
  }

  const b = Object.assign(a, {
    age: 18
  })

  console.log(a === b, a, b)
})

test('delete', () => {
  const aoo = {
    name: 'hello',
    age: 18,
    cars: ['a', 'b']
  }

  const boo = Object.assign(aoo, {
    'name': 'world'
  })

  const s = new Set([aoo, boo])
  console.log(s)
})

test('coordinateMap', () => {
  const coordinateMap = new Map()
  const x = 0, y = 1
  coordinateMap.set(`${x},${y}`, 1)

  const ans = coordinateMap.get(`${x},${y}`)

  console.log(ans)

  console.log(coordinateMap.has('22,22'))
})

test('async', () => {
  new Promise((resolve) => {
    setTimeout(() => {
      resolve(1)
    }, 3000)
  }).then(r => {
    console.log(r)
  })
  console.log('end')
})

test('nested', () => {
  const aoo = ref({
    name: 'hello',
    address: undefined
  })
  aoo.value.address = shallowRef({
    x1: '湖北',
    x2: '天门'
  })
  console.log(aoo)
  console.log(isRef(aoo.value.name))
})