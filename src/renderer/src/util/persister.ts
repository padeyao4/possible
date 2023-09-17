import { PiniaPlugin, PiniaPluginContext } from 'pinia'

function persist(stateId, state) {
  const res = window.api.statePersist(stateId, JSON.stringify(state))
  console.log('persist', res)
}

export function createPersister(): PiniaPlugin {
  return (context: PiniaPluginContext) => {
    const { store } = context
    store.$hydrate = () => {
      // todo 从数据库恢复数据, eg. store.$patch(data)
    }
    store.$persit = () => {
      //  将数据保存到数据库
      persist(store.$id, store.$state)
    }
    store.$subscribe(() => {
      // store some change
      console.log('subscribe', new Date(), store.$state, store.$id)
      persist(store.$id, store.$state)
    })
  }
}
