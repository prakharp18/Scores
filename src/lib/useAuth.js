import { useEffect, useState } from 'react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from './firebase'

export default function useAuth() {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('auth_user')) || null } catch { return null }
  })

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, u => {
      if (u) {
        const payload = { type: 'user', id: u.uid, name: u.displayName, email: u.email, photoURL: u.photoURL }
        localStorage.setItem('auth_user', JSON.stringify(payload))
        setUser(payload)
      } else {
        localStorage.removeItem('auth_user')
        setUser(null)
      }
    })
    return () => unsub()
  }, [])

  return { user }
}
