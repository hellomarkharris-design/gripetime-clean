
const base = '' // same origin; Hosting rewrites /api/* to functions

async function j(method, url, body){
  const headers = { 'Content-Type':'application/json' }
  const res = await fetch(base+url, { method, headers, body: body? JSON.stringify(body): undefined })
  if (!res.ok) throw new Error(await res.text())
  return res.json()
}

export async function listGripes(){ return j('GET','/api/gripes') }
export async function getGripe(id){ return j('GET', `/api/gripes/${id}`) }

export async function createGripe({ imagesDataUrls=[], text='', daysActive=5, avatar=null, title='' }){
  return j('POST', '/api/gripes', { imagesDataUrls, text, daysActive, avatar, title })
}
export async function respondToGripe(id, { imagesDataUrls=[], text='', avatar=null }){
  return j('POST', `/api/gripes/${id}/respond`, { imagesDataUrls, text, avatar })
}
export async function vote(id, side, stars=5){
  return j('POST', `/api/gripes/${id}/vote`, { side, stars })
}
export async function listComments(id){ return j('GET', `/api/gripes/${id}/comments`) }
export async function addComment(id, text, displayName=''){ return j('POST', `/api/gripes/${id}/comments`, { text, displayName }) }
export async function setExpiresAt(id, expiresAtMs){ return j('POST', `/api/gripes/${id}/setExpires`, { expiresAtMs }) }
export async function closeGripe(id){ return j('POST', `/api/gripes/${id}/close`) }
export async function adminEditTexts(id, body){ return j('POST', `/api/gripes/${id}/editTexts`, body) }
