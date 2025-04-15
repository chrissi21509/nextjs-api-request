import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
 
  res.setHeader('Access-Control-Allow-Origin', 'https://blockify.icu')
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')

  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

 
  const { message } = req.body
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL

  if (!webhookUrl) return res.status(500).json({ error: 'Missing webhook URL' })
  if (!message) return res.status(400).json({ error: 'Message is required' })

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ content: message }),
    })

    if (!response.ok) throw new Error('Failed to send to Discord')

    return res.status(200).json({ success: true })
  } catch (err) {
    return res.status(500).json({ error: err instanceof Error ? err.message : 'Unknown error' })
  }
}
