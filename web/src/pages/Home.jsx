
import React, { useEffect, useState } from 'react'
import { listGripes, getGripe, vote } from '../api'
import { useParams, useNavigate } from 'react-router-dom'
import HeadToHead from '../components/HeadToHead'

export default function Home(){
  const [gripes, setGripes] = useState([])
  const [selected, setSelected] = useState(null)
  const [starsL, setStarsL] = useState(5)
  const [starsR, setStarsR] = useState(5)
  const { id } = useParams()
  const nav = useNavigate()

  useEffect(()=>{ (async()=>{
    const g = await listGripes()
    setGripes(g)
    const pick = id || (g[0]?.id)
    if (pick) setSelected(await getGripe(pick))
  })() }, [id])

  async function onSelect(id){
    nav(`/gripe/${id}`)
    setSelected(await getGripe(id))
  }

  async function onVote(side, stars){
    if(!selected) return
    const nowMs = Date.now()
    const exp = selected.expiresAt?.seconds ? selected.expiresAt.seconds*1000 : null
    if (selected.status !== 'Active') return alert('This gripe is closed.')
    if (exp && nowMs >= exp) return alert('Voting is closed for this gripe.')
    await vote(selected.id, side, stars)
    setSelected(await getGripe(selected.id))
    alert('Vote recorded')
  }

  return (
    <div className="card">
      <select style={{width:'100%',padding:12,marginBottom:12}} onChange={(e)=>onSelect(e.target.value)} value={selected?.id || ''}>
        {gripes.length ? gripes.map(g => <option key={g.id} value={g.id}>{g.title || g.id}</option>) : <option>(no gripes yet)</option>}
      </select>
      {selected && (<HeadToHead gripe={selected} onVote={onVote} starsL={starsL} setStarsL={setStarsL} starsR={starsR} setStarsR={setStarsR} />)}
    </div>
  )
}
