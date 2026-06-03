export default function handler(req, res) {
  // CORS for RapidAPI
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'X-RapidAPI-Key, Content-Type')
  
  if (req.method === 'OPTIONS') return res.status(200).end()

  const { pattern, flags = '', test } = req.method === 'GET'? req.query : req.body
  
  if (!pattern || test === undefined) {
    return res.status(400).json({ 
      valid: false, 
      error: 'Missing required params: pattern, test' 
    })
  }

  try {
    const re = new RegExp(pattern, flags)
    const matches = [...test.matchAll(re)].map(m => ({
      match: m[0],
      index: m.index,
      groups: m.slice(1),
      length: m[0].length
    }))
    
    res.status(200).json({ 
      valid: true, 
      pattern,
      flags,
      matches, 
      count: matches.length 
    })
  } catch (e) {
    res.status(400).json({ 
      valid: false, 
      pattern,
      flags,
      error: e.message 
    })
  }
}
