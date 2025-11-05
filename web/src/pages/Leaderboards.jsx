
import React, { useEffect, useState } from 'react'
import { listGripes } from '../api'

export default function Leaderboards(){
  const [items,setItems] = useState([])
  useEffect(()=>{ (async ()=>{
    const g = await listGripes()
    const scored = g.map(x=>{
      const total = (x.votes?.griperCount||0) + (x.votes?.gripeeCount||0)
      const ageDays = x.createdAt?.seconds ? (Date.now()-x.createdAt.seconds*1000)/(1000*60*60*24) : 999
      const bonus = Math.max(0, 10 - ageDays)
      return { ...x, total, score: total + bonus }
    }).sort((a,b)=> b.score - a.score)
    setItems(scored)
  })() }, [])

  return (
    <div className="card">
      <h2>Leaderboards</h2>
      <table className="table">
        <thead><tr><th>Gripe</th><th>Status</th><th>Votes (L|R)</th><th>Total</th><th>Score</th></tr></thead>
        <tbody>
          {items.map(x=>(
            <tr key={x.id}>
              <td>{x.title || x.id}</td>
              <td>{x.status}</td>
              <td>{(x.votes?.griperCount||0)} | {(x.votes?.gripeeCount||0)}</td>
              <td>{x.total}</td>
              <td>{Math.round(x.score)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
