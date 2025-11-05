
import React, { useEffect, useState } from 'react'
import { auth, signInEmail, signUpEmail, signOutApp, isAdmin } from '../firebase'

export default function Auth(){
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [admin, setAdmin] = useState(false)

  useEffect(()=>{
    const unsub = auth.onAuthStateChanged(async (u)=>{
      setUser(u)
      setAdmin(u ? await isAdmin(u.uid) : false)
    })
    return ()=>unsub()
  },[])

  return (
    <div className="card">
      <h2>Account</h2>
      {user ? (
        <>
          <p>Signed in as: {user.email || '(anonymous)'} {admin && '— Admin'}</p>
          <button className="btn" onClick={signOutApp}>Sign out</button>
        </>
      ) : (
        <>
          <div className="grid2">
            <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} />
            <input type="password" placeholder="Password" value={password} onChange={e=>setPassword(e.target.value)} />
          </div>
          <br/>
          <div className="grid2">
            <button className="btn" onClick={()=>signUpEmail(email,password)}>Sign up</button>
            <button className="btn neon" onClick={()=>signInEmail(email,password)}>Sign in</button>
          </div>
        </>
      )}
    </div>
  )
}
