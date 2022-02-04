import { createContext, useContext, useState, useEffect } from 'react'
import firebase from 'firebase/app'

import 'firebase/auth'

firebase.initializeApp(JSON.parse(process.env.FIREBASE_CONFIG || ''))

if (process.env.NODE_ENV !== 'production') {
  firebase.auth().useEmulator('http://localhost:9099')
}

export function useAnonymousLogin(): firebase.User | null | undefined {
  const [user, setUser] = useState<firebase.User | null | undefined>()

  useEffect(() => {
    return firebase.auth().onAuthStateChanged((user) => {
      setUser(user)

      if (!user) {
        firebase.auth().signInAnonymously().catch(console.error)
        return
      }
    })
  }, [])

  return user
}

export const UserContext = createContext<firebase.User | null | undefined>(null)

export const useUser = (): firebase.User | null | undefined =>
  useContext(UserContext)
