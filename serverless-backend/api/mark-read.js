import { connectDB } from '../lib/db.js';
import Link from '../models/Link.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'PATCH, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow PATCH
  if (req.method !== 'PATCH') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { id } = req.query;
    const { isRead } = req.body;

    if (!id) {
      return res.status(400).json({ error: 'Link ID is required' });
    }

    const updatedLink = await Link.findByIdAndUpdate(
      id,
      { isRead },
      { new: true }
    );

    if (!updatedLink) {
      return res.status(404).json({ error: 'Link not found' });
    }

    return res.status(200).json(updatedLink);
  } catch (error) {
    console.error('Error updating link:', error);
    return res.status(500).json({ error: 'Failed to update link' });
  }
}
