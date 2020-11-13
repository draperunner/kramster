import { createContext, useContext, useState, useEffect } from 'react'
import firebase from 'firebase/app'

import 'firebase/analytics'
import 'firebase/auth'

firebase.initializeApp({
  apiKey: 'AIzaSyDubEbkaUX-Yyx4b1ZYYHZ_ba5sEi9aPbU',
  authDomain: 'kramster-staging.firebaseapp.com',
  databaseURL: 'https://kramster-staging.firebaseio.com',
  projectId: 'kramster-staging',
  storageBucket: 'kramster-staging.appspot.com',
  messagingSenderId: '591159005378',
  appId: '1:591159005378:web:fa1e2ed1914ec3f27f2b5b',
})

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
