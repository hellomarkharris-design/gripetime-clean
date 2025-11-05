
import React, { useState } from 'react'
import { createGripe } from '../api'

export default function Create(){
  const [files, setFiles] = useState([])
  const [text, setText] = useState('')
  const [days, setDays] = useState(5)
  const [title, setTitle] = useState('')

  function onPick(e){ setFiles(Array.from(e.target.files).slice(0,3)) }
  function clip1000(s){ const w = s.trim().split(/\s+/); return w.length>1000 ? w.slice(0,1000).join(' ') : s }
  async function toDataUrls(fs){ const readers = fs.map(f=>new Promise(res=>{const fr=new FileReader();fr.onload=e=>res(e.target.result);fr.readAsDataURL(f)})); return Promise.all(readers) }

  async function onSave(){
    const id = await createGripe({ imagesDataUrls: await toDataUrls(files), text: clip1000(text), daysActive: days, title })
    alert('Gripe created: ' + id)
  }

  return (
    <div className="card">
      <h2>Create a Gripe</h2>
      <div className="grid2">
        <div>
          <input type="file" multiple accept="image/*" onChange={onPick}/>
          <div>{Math.min(3, files.length)} / 3 selected</div>
        </div>
        <div>
          <input placeholder="(Optional) title" value={title} onChange={e=>setTitle(e.target.value)} />
          <textarea rows="8" value={text} onChange={e=>setText(e.target.value)} style={{width:'100%'}} placeholder="Describe your gripe (1000 words max)"/>
          <div><label>Active days: </label><input type="number" value={days} onChange={e=>setDays(e.target.value)} style={{width:100}}/></div>
        </div>
      </div>
      <br/>
      <button className="btn" onClick={onSave}>Save</button>
    </div>
  )
}
