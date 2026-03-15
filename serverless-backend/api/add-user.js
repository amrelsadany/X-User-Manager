import { connectDB } from '../lib/db.js';
import User from '../models/User.js';

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
    const existingUser = await User.findOne({ url });
    if (existingUser) {
      return res.status(409).json({ 
        error: 'User already exists',
        existing: existingUser 
      });
    }

    const newUser = new User({
      url,
      title: title || (username ? `@${username}` : ''),
      username: username || '',
      userId: userId || '',
      isRead: false
    });

    await newUser.save();
    return res.status(201).json(newUser);
  } catch (error) {
    console.error('Error adding user:', error);
    return res.status(500).json({ error: 'Failed to add user' });
  }
}
