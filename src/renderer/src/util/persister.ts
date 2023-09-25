import debounce from 'lodash/debounce'
import { PiniaPlugin, PiniaPluginContext } from 'pinia'

function persist(stateId: string, state: object) {
  window.api.statePersist(stateId, JSON.stringify(state))
}

export function createPersistent(): PiniaPlugin {
  return (context: PiniaPluginContext) => {
    const { store } = context
    store.$hydrate = async () => {
      // 从数据库恢复数据, eg. store.$patch(data)

      const r = await window.api.stateQuery(store.$id)
      if (r !== null) {
        store.$patch(r)
      }
    }
    store.$persist = () => {
      //  将数据保存到数据库
      persist(store.$id, store.$state)
    }
    const debouncePersist = debounce(() => {
      persist(store.$id, store.$state)
    }, 2_000)

    store.$subscribe(() => {
      // store some change
      debouncePersist()
    })
  }
}
