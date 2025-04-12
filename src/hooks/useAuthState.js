import { useState, useEffect } from 'react'
import { 
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendEmailVerification
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from '../config/firebase'

export function useAuthState() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Get additional user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid))
        const userData = userDoc.data()
        setUser({ ...user, ...userData })
      } else {
        setUser(null)
      }
      setLoading(false)
    })

    return unsubscribe
  }, [])

  const login = async (email, password) => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      return userCredential.user
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  const register = async (email, password, userData) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      // Create user document in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        isAdmin: false,
        createdAt: new Date().toISOString(),
        ...userData
      })

      // Send email verification
      await sendEmailVerification(user)

      return user
    } catch (error) {
      setError(error.message)
      throw error
    }
  }

  const logout = () => signOut(auth)

  return {
    user,
    loading,
    error,
    login,
    register,
    logout
  }
}