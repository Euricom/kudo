import type { Channel, PresenceChannel } from 'pusher-js'
import type { StoreApi } from 'zustand'
import type { PropsWithChildren } from 'react'

import { useEffect, useRef, useState, createContext, useContext } from 'react'
import Pusher from 'pusher-js'
import { create } from 'zustand'
import { type Session } from '~/types'
import { type Kudo } from '@prisma/client'

interface PusherZustandStore {
  pusherClient: Pusher
  channel: Channel
  presenceChannel: PresenceChannel
  kudos: Kudo[]
  sessions: Session[]
}

const createPusherStore = (slug: string) => {
  let pusherClient: Pusher
  if (Pusher.instances.length) {
    pusherClient = Pusher.instances[0] as Pusher
    pusherClient.connect()
  } else {
    const randomUserId = `random-user-id:${Math.random().toFixed(7)}`
    pusherClient = new Pusher(process.env.PUSHER_KEY!, {
      cluster: process.env.PUSHER_CLUSTER??"eu",
      authEndpoint: '/api/pusher/auth-channel',
      auth: {
        headers: { user_id: randomUserId },
      },
    })
  }

  const channel = pusherClient.subscribe(slug)

  const presenceChannel = pusherClient.subscribe(
    `presence-${slug}`
  ) as PresenceChannel

  const store = create<PusherZustandStore>((set) => ({
    pusherClient,
    channel,
    presenceChannel,
    kudos: [],
    sessions: [],
    // addKudos: () => set((state) => ({ bears: state.bears + 1 })),
    // addSessions: () => set((state) => ({ bears: state.bears + 1 })),
    removeAllKudos: () => set({ kudos: [] }),
    removeAllSessions: () => set({ sessions: [] }),
  }))
  return store
}

/**
 * Section 2: "The Context Provider"
 *
 * This creates a "Zustand React Context" that we can provide in the component tree.
 */
const PusherZustandStoreContext = createContext<StoreApi<PusherZustandStore> | undefined>(undefined);

/**
 * This provider is the thing you mount in the app to "give access to Pusher"
 *
 */
export const PusherProvider = ({
  slug,
  children,
}: PropsWithChildren<{ slug: string }>) => {
  const storeRef = useRef<StoreApi<PusherZustandStore>>()
  const [store, setStore] = useState<StoreApi<PusherZustandStore>>()

  useEffect(() => {
    const newStore = createPusherStore(slug)
    storeRef.current = newStore
    setStore(newStore)
    return () => {
      const pusher = newStore.getState().pusherClient
      console.log('disconnecting pusher and destroying store', pusher)
      console.log(
        '(Expect a warning in terminal after this, React Dev Mode and all)'
      )
      pusher.disconnect()
      const unsubscribe = newStore.subscribe(() => void 0)
      unsubscribe()
    }
  }, [slug])

  if (!store) return null

  return (
    <PusherZustandStoreContext.Provider value={store}>
      {children}
    </PusherZustandStoreContext.Provider>
  )
}

export const usePusherZustandStore = () => {
  const store = useContext(PusherZustandStoreContext);
  if (!store) {
    throw new Error("usePusherZustandStore must be used within a PusherZustandStoreProvider");
  }
  return store;
};

/**
 * Section 3: "The Hooks"
 *
 * The exported hooks you use to interact with this store (in this case just an event sub)
 *
 * (I really want useEvent tbh)
 */
export function useSubscribeToEvent<MessageType>(
  eventName: string,
  callback: (data: MessageType) => void
) {
  const channel: Channel = usePusherZustandStore().getState().channel

  const stableCallback = useRef(callback)

  // Keep callback sync'd
  useEffect(() => {
    stableCallback.current = callback
  }, [callback])

  useEffect(() => {
    const reference = (data: MessageType) => {
      stableCallback.current(data)
    }
    channel.bind(eventName, reference)
    return () => {
      channel.unbind(eventName, reference)
    }
  }, [channel, eventName])
}
