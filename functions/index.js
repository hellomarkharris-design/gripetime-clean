
import functions from 'firebase-functions'
import admin from 'firebase-admin'
import express from 'express'
import cors from 'cors'

admin.initializeApp()
const db = admin.firestore()
const app = express()
app.use(cors({ origin: true }))
app.use(express.json({ limit: '10mb' }))

function gripeRef(id){ return db.collection('gripes').doc(id) }
function votesRef(id){ return gripeRef(id).collection('votes') }
function commentsRef(id){ return gripeRef(id).collection('comments') }

// List
app.get('/gripes', async (req,res)=>{
  const snap = await db.collection('gripes').orderBy('createdAt','desc').get()
  res.json(snap.docs.map(d=>({ id:d.id, ...d.data() })))
})

// Get one
app.get('/gripes/:id', async (req,res)=>{
  const doc = await gripeRef(req.params.id).get()
  if (!doc.exists) return res.status(404).send('Not found')
  res.json({ id:doc.id, ...doc.data() })
})

// Create
app.post('/gripes', async (req,res)=>{
  const { imagesDataUrls=[], text='', daysActive=5, avatar=null, title='' } = req.body||{}
  const createdAt = admin.firestore.Timestamp.now()
  const expiresAt = admin.firestore.Timestamp.fromDate(new Date(Date.now()+Number(daysActive)*24*60*60*1000))
  const d = await db.collection('gripes').add({
    title, status:'Active', createdAt, expiresAt,
    griper:{ text, images:imagesDataUrls.slice(0,3), avatar },
    gripee:{ text:'', images:[], avatar:null },
    votes:{ griperCount:0, gripeeCount:0 }
  })
  res.json(d.id)
})

// Respond
app.post('/gripes/:id/respond', async (req,res)=>{
  const { imagesDataUrls=[], text='', avatar=null } = req.body || {}
  await gripeRef(req.params.id).update({
    gripee:{ text, images:imagesDataUrls.slice(0,3), avatar }
  })
  res.json({ ok:true })
})

// Vote (naive per-IP/UA)
app.post('/gripes/:id/vote', async (req,res)=>{
  const { side, stars=5 } = req.body || {}
  const key = (req.headers['x-forwarded-for'] || req.ip || 'ip') + '::' + (req.headers['user-agent'] || 'ua')
  const vid = Buffer.from(key).toString('base64').slice(0,100)
  const vdoc = votesRef(req.params.id).doc(vid)
  const prev = await vdoc.get()
  if (prev.exists) return res.status(400).send('Already voted')
  await vdoc.set({ side, stars, createdAt: admin.firestore.FieldValue.serverTimestamp() })

  const gref = gripeRef(req.params.id)
  const g = await gref.get()
  if (!g.exists) return res.status(404).send('Not found')
  const data = g.data()
  const L = data.votes?.griperCount || 0
  const R = data.votes?.gripeeCount || 0
  await gref.update({
    'votes.griperCount': side==='L'? L+1 : L,
    'votes.gripeeCount': side==='R'? R+1 : R
  })
  res.json({ ok:true })
})

// Comments
app.get('/gripes/:id/comments', async (req,res)=>{
  const snap = await commentsRef(req.params.id).orderBy('createdAt','desc').get()
  res.json(snap.docs.map(d=>({ id:d.id, ...d.data() })))
})
app.post('/gripes/:id/comments', async (req,res)=>{
  const { text='', displayName='' } = req.body || {}
  await commentsRef(req.params.id).add({ text, displayName, createdAt: admin.firestore.FieldValue.serverTimestamp() })
  res.json({ ok:true })
})

// Admin
app.post('/gripes/:id/setExpires', async (req,res)=>{
  const { expiresAtMs } = req.body || {}
  await gripeRef(req.params.id).update({ expiresAt: admin.firestore.Timestamp.fromDate(new Date(Number(expiresAtMs))) })
  res.json({ ok:true })
})
app.post('/gripes/:id/close', async (req,res)=>{
  await gripeRef(req.params.id).update({ status:'Resolved' })
  res.json({ ok:true })
})
app.post('/gripes/:id/editTexts', async (req,res)=>{
  const { griperText, gripeeText } = req.body || {}
  const ref = gripeRef(req.params.id)
  const snap = await ref.get()
  if (!snap.exists) return res.status(404).send('Not found')
  const data = snap.data()
  await ref.update({
    griper: { ...(data.griper||{}), text: griperText ?? data.griper?.text ?? '' },
    gripee: { ...(data.gripee||{}), text: gripeeText ?? data.gripee?.text ?? '' }
  })
  res.json({ ok:true })
})

export const api = functions.https.onRequest(app)
