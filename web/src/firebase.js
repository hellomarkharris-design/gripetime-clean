
import { initializeApp } from 'firebase/app'
import {
  getAuth, onAuthStateChanged, signInAnonymously,
  createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut
} from 'firebase/auth'
import { getFirestore, doc, getDoc } from 'firebase/firestore'
import { getStorage } from 'firebase/storage'

const firebaseConfig = {
  apiKey: import.meta.env.VITE_API_KEY,
  authDomain: import.meta.env.VITE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_APP_ID,
}

export const app = initializeApp(firebaseConfig)
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

export function ensureAnonSignIn(){
  return new Promise((res)=>{
    onAuthStateChanged(auth, (u)=>{
      if (u) return res(u)
      signInAnonymously(auth).then(({ user })=>res(user))
    })
  })
}
export async function signUpEmail(email, password){ return (await createUserWithEmailAndPassword(auth,email,password)).user }
export async function signInEmail(email, password){ return (await signInWithEmailAndPassword(auth,email,password)).user }
export async function signOutApp(){ return signOut(auth) }
export async function isAdmin(uid){
  if (!uid) return false
  const snap = await getDoc(doc(db, 'admins', uid))
  return snap.exists()
}
