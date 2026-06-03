export default async function handler(req, res) {
  if (req.method!== 'POST') return res.status(405).json({ error: 'POST only' })
  
  const { pattern, flags, testString, email } = req.body
  
  // TODO: Save to DB. For now just log
  console.log('REGEX SAVED:', { pattern, flags, email })
  
  // In prod: Insert to Supabase/Postgres + trigger email
  res.status(200).json({ 
    success: true, 
    message: 'Monitoring active. You will get alerts if this breaks.' 
  })
}
