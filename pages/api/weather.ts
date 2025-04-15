import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

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

    if (!response.ok) throw new Error('Discord webhook failed')

    return res.status(200).json({ success: true })
  } catch (error) {
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' })
  }
}
