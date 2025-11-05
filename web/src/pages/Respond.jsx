
import React, { useEffect, useState } from 'react'
import { listGripes, respondToGripe } from '../api'

export default function Respond(){
  const [gripes,setGripes] = useState([])
  const [id,setId] = useState('')
  const [text, setText] = useState('')
  const [files, setFiles] = useState([])

  useEffect(()=>{ (async()=>{ const g=await listGripes(); setGripes(g); if(g.length) setId(g[0].id) })() },[])
  function onPick(e){ setFiles(Array.from(e.target.files).slice(0,3)) }
  function clip1000(s){ const w = s.trim().split(/\s+/); return w.length>1000 ? w.slice(0,1000).join(' ') : s }
  async function toDataUrls(fs){ const readers = fs.map(f=>new Promise(res=>{const fr=new FileReader();fr.onload=e=>res(e.target.result);fr.readAsDataURL(f)})); return Promise.all(readers) }

  async function onSave(){
    await respondToGripe(id, { imagesDataUrls: await toDataUrls(files), text: clip1000(text) })
    alert('Response saved')
  }

  return (
    <div className="card">
      <h2>Respond</h2>
      <select value={id} onChange={e=>setId(e.target.value)}>{gripes.map(g=><option key={g.id} value={g.id}>{g.title || g.id}</option>)}</select>
      <div className="grid2" style={{marginTop:10}}>
        <div><input type="file" multiple accept="image/*" onChange={onPick}/></div>
        <div><textarea rows="8" value={text} onChange={e=>setText(e.target.value)} style={{width:'100%'}}/></div>
      </div>
      <br/><button className="btn" onClick={onSave}>Save Response</button>
    </div>
  )
}
