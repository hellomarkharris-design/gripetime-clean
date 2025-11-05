
import React, { useEffect, useState } from 'react'
import { listGripes, getGripe, setExpiresAt, closeGripe, adminEditTexts } from '../api'
import { auth, isAdmin } from '../firebase'

export default function Admin(){
  const [ok, setOk] = useState(false)
  const [gripes, setGripes] = useState([])
  const [id, setId] = useState('')
  const [gripe, setGripe] = useState(null)
  const [days, setDays] = useState(5)
  const [griperText, setGriperText] = useState('')
  const [gripeeText, setGripeeText] = useState('')

  useEffect(()=>{
    const unsub = auth.onAuthStateChanged(async (u)=>{
      const allowed = u ? await isAdmin(u.uid) : false
      setOk(allowed)
      if (allowed){
        const g = await listGripes()
        setGripes(g)
        if (g.length){ setId(g[0].id); setGripe(await getGripe(g[0].id)) }
      }
    })
    return ()=>unsub()
  },[])

  useEffect(()=>{ (async ()=>{ if (id) setGripe(await getGripe(id)) })() },[id])

  if (!ok) return <div className="card"><h2>Admin</h2><p>You must be an admin.</p></div>

  async function onSetExpires(){
    const base = gripe?.createdAt?.seconds ? new Date(gripe.createdAt.seconds*1000) : new Date()
    const exp = new Date(base.getTime() + Number(days)*24*60*60*1000)
    await setExpiresAt(id, exp.getTime())
    alert('Expires set')
    setGripe(await getGripe(id))
  }
  async function onClose(){
    await closeGripe(id)
    alert('Closed'); setGripe(await getGripe(id))
  }
  async function onSaveTexts(){
    await adminEditTexts(id, { griperText, gripeeText })
    alert('Updated'); setGripe(await getGripe(id))
  }

  return (
    <div className="card">
      <h2>Admin</h2>
      <select value={id} onChange={e=>setId(e.target.value)}>
        {gripes.map(g=><option key={g.id} value={g.id}>{g.title||g.id}</option>)}
      </select>

      {gripe && (
        <div style={{marginTop:12}}>
          <div><strong>Status:</strong> {gripe.status}</div>
          <div><strong>Votes:</strong> L {gripe.votes?.griperCount ?? 0} | R {gripe.votes?.gripeeCount ?? 0}</div>
          <div className="grid2" style={{marginTop:10}}>
            <input type="number" min="1" value={days} onChange={e=>setDays(e.target.value)} />
            <button className="btn" onClick={onSetExpires}>Set Expires = Created + N days</button>
          </div>
          <div className="grid2" style={{marginTop:10}}>
            <textarea rows="6" value={griperText} onChange={e=>setGriperText(e.target.value)} placeholder="Griper text override"/>
            <textarea rows="6" value={gripeeText} onChange={e=>setGripeeText(e.target.value)} placeholder="Gripee text override"/>
          </div>
          <div className="grid2" style={{marginTop:10}}>
            <button className="btn" onClick={onSaveTexts}>Save Texts</button>
            <button className="btn" onClick={onClose}>Close Gripe</button>
          </div>
        </div>
      )}
    </div>
  )
}
