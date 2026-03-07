import { connectDB } from '../lib/db.js';
import Link from '../models/Link.js';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    await connectDB();

    const { url, title, username, userId } = req.body;

    if (!url) {
      return res.status(400).json({ error: 'URL is required' });
    }

    // Check for duplicates
    const existingLink = await Link.findOne({ url });
    if (existingLink) {
      return res.status(409).json({ 
        error: 'Link already exists',
        existing: existingLink 
      });
    }

    // Create new link with optional username and userId
    const newLink = new Link({
      url,
      title: title || '',
      username: username || '',
      userId: userId || '',
      isRead: false
    });

    await newLink.save();
    return res.status(201).json(newLink);
  } catch (error) {
    console.error('Error adding link:', error);
    return res.status(500).json({ error: 'Failed to add link' });
  }
}
