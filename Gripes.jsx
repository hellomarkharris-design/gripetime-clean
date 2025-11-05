
import React, { useEffect, useState } from 'react'
import { listGripes } from '../api'

export default function Gripes(){
  const [gripes,setGripes] = useState([])
  useEffect(()=>{ (async ()=> setGripes(await listGripes()))() },[])
  return (
    <div className="card">
      <h2>All Gripes</h2>
      <ul style={{listStyle:'none', padding:0}}>
        {gripes.map(g=>(
          <li key={g.id} className="card">
            <div style={{display:'flex',justifyContent:'space-between',flexWrap:'wrap',gap:8}}>
              <div><strong>{g.title || g.id}</strong></div>
              <div>Status: <strong>{g.status}</strong></div>
              <div>Votes: L {g.votes?.griperCount ?? 0} | R {g.votes?.gripeeCount ?? 0}</div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
