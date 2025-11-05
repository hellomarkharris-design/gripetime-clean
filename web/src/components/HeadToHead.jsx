
import React from 'react'
import '../styles.css'

export default function HeadToHead({ gripe, onVote, starsL, setStarsL, starsR, setStarsR }) {
  const L = gripe?.griper || { images:[], text:'', avatar:null }
  const R = gripe?.gripee || { images:[], text:'', avatar:null }
  const bg = (url) => url ? { background:`url(${url}) center/cover` } : {}
  const main = (side) => side?.images?.[0] || side?.avatar || null

  return (
    <div className="card">
      <div style={{textAlign:'center', marginBottom:10}}>
        <img src="/gripetime-logo.png" alt="Gripetime" style={{width:"260px", maxWidth:"90%"}} />
      </div>

      <div className="ring">
        <div className="card">
          <div className="cornerName red" style={{fontSize:"40px"}}>GRIPER</div>
          <div className="photoCircle" style={bg(main(L))}>{!main(L) && 'PHOTO'}</div>
          <div className="mainPhoto" style={bg(main(L))}>{!main(L) && 'Main Image'}</div>
          <div className="thumbs">
            <div className="thumb" style={bg(L.images[1])}>{!L.images[1] && 'Photo 2'}</div>
            <div className="thumb" style={bg(L.images[2])}>{!L.images[2] && 'Photo 3'}</div>
          </div><br/>
          <textarea readOnly value={L.text || ''} style={{minHeight:120}} />
          <div className="voteRow">
            <div className="stars">
              {[1,2,3,4,5].map(s=>
                <button key={s} onClick={()=>setStarsL(s)} style={starsL===s?{background:'#2f3a85'}:{}}>{s}★</button>
              )}
            </div>
            <button className="btn" onClick={()=>onVote('L', starsL || 5)}>VOTE</button>
          </div>
        </div>

        <div className="vsWrap"><div className="vs">VS</div></div>

        <div className="card">
          <div className="cornerName blue" style={{fontSize:"40px"}}>GRIPEE</div>
          <div className="photoCircle" style={bg(main(R))}>{!main(R) && 'PHOTO'}</div>
          <div className="mainPhoto" style={bg(main(R))}>{!main(R) && 'Main Image'}</div>
          <div className="thumbs">
            <div className="thumb" style={bg(R.images[1])}>{!R.images[1] && 'Photo 2'}</div>
            <div className="thumb" style={bg(R.images[2])}>{!R.images[2] && 'Photo 3'}</div>
          </div><br/>
          <textarea readOnly value={R.text || ''} style={{minHeight:120}} />
          <div className="voteRow">
            <div className="stars">
              {[1,2,3,4,5].map(s=>
                <button key={s} onClick={()=>setStarsR(s)} style={starsR===s?{background:'#2f3a85'}:{}}>{s}★</button>
              )}
            </div>
            <button className="btn neon" onClick={()=>onVote('R', starsR || 5)}>VOTE</button>
          </div>
        </div>
      </div>

      <div style={{textAlign:'center',marginTop:12}}>
        Griper: <strong>{gripe?.votes?.griperCount ?? 0}</strong> |
        Gripee: <strong>{gripe?.votes?.gripeeCount ?? 0}</strong>
      </div>
    </div>
  )
}
