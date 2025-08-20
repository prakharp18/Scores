import { signInWithPopup, signOut as firebaseSignOut } from 'firebase/auth'
import { auth, googleProvider } from './firebase'

export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider)
    return result.user
  } catch (e) {
    console.error('signInWithGoogle error', e)
    throw e
  }
}

export async function signOut() {
  try {
    await firebaseSignOut(auth)
  } catch (e) {
    console.error('signOut error', e)
  }
}
