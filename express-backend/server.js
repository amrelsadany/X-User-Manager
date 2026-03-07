require('dotenv').config();
const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection string - Can be configured via .env file
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'linksdb';
const LINKS_COLLECTION = process.env.LINKS_COLLECTION || 'users';
const OPENED_LINKS_COLLECTION = process.env.OPENED_LINKS_COLLECTION || 'opened_links';

let db;
let linksCollection;
let openedLinksCollection;

// Connect to MongoDB
async function connectToDatabase() {
  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB');
    
    db = client.db(DB_NAME);
    linksCollection = db.collection(LINKS_COLLECTION); // Collection with link URLs
    openedLinksCollection = db.collection(OPENED_LINKS_COLLECTION); // Collection tracking opened links
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
}

// Create a new link
app.post('/api/links', async (req, res) => {
  try {
    const { username, url, userId } = req.body;
    
    // Validate required fields
    if (!url || url.trim() === '') {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    // Check if URL already exists
    const existingLink = await linksCollection.findOne({ url: url.trim() });
    if (existingLink) {
      return res.status(409).json({ 
        error: 'This URL already exists',
        existingLink: existingLink
      });
    }
    
    // Build new link object
    const newLink = {
      username: username ? username.trim() : '',
      url: url.trim(),
      userId: userId || null
    };
    
    // Insert the new link
    const result = await linksCollection.insertOne(newLink);
    
    // Get the inserted link with its _id
    const insertedLink = await linksCollection.findOne({ _id: result.insertedId });
    
    res.status(201).json({ 
      message: 'Link created successfully', 
      link: insertedLink 
    });
  } catch (error) {
    console.error('Error creating link:', error);
    res.status(500).json({ error: 'Failed to create link' });
  }
});

// Get all unread links
app.get('/api/links', async (req, res) => {
  try {
    // Get all links from users collection where url is not empty
    const allLinks = await linksCollection.find({ 
      url: { $exists: true, $ne: "" } 
    }).toArray();
    
    // Get all opened link IDs
    const openedLinks = await openedLinksCollection.find({}).toArray();
    const openedLinkIds = new Set(openedLinks.map(link => link.linkId.toString()));
    
    // Filter out opened links
    const unreadLinks = allLinks.filter(link => !openedLinkIds.has(link._id.toString()));
    
    res.json(unreadLinks);
  } catch (error) {
    console.error('Error fetching links:', error);
    res.status(500).json({ error: 'Failed to fetch links' });
  }
});

// Mark link as opened
app.post('/api/links/:id/mark-opened', async (req, res) => {
  try {
    const linkId = req.params.id;
    
    // Check if already marked as opened
    const existing = await openedLinksCollection.findOne({ 
      linkId: new ObjectId(linkId) 
    });
    
    if (existing) {
      return res.json({ message: 'Link already marked as opened', existing });
    }
    
    // Insert into opened_links collection
    const result = await openedLinksCollection.insertOne({
      linkId: new ObjectId(linkId),
      openedAt: new Date()
    });
    
    res.json({ 
      message: 'Link marked as opened', 
      result 
    });
  } catch (error) {
    console.error('Error marking link as opened:', error);
    res.status(500).json({ error: 'Failed to mark link as opened' });
  }
});

// Update/Edit a link
app.put('/api/links/:id', async (req, res) => {
  try {
    const linkId = req.params.id;
    const { username, url, userId } = req.body;
    
    // Validate required fields
    if (!url || url.trim() === '') {
      return res.status(400).json({ error: 'URL is required' });
    }
    
    // Build update object
    const updateData = {
      url: url.trim()
    };
    
    // Add optional fields if provided
    if (username !== undefined) {
      updateData.username = username.trim();
    }
    if (userId !== undefined) {
      updateData.userId = userId;
    }
    
    // Update the link
    const result = await linksCollection.updateOne(
      { _id: new ObjectId(linkId) },
      { $set: updateData }
    );
    
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Link not found' });
    }
    
    // Get the updated link
    const updatedLink = await linksCollection.findOne({ _id: new ObjectId(linkId) });
    
    res.json({ 
      message: 'Link updated successfully', 
      link: updatedLink 
    });
  } catch (error) {
    console.error('Error updating link:', error);
    res.status(500).json({ error: 'Failed to update link' });
  }
});

// Delete a link
app.delete('/api/links/:id', async (req, res) => {
  try {
    const linkId = req.params.id;
    
    // Delete the link
    const result = await linksCollection.deleteOne({ _id: new ObjectId(linkId) });
    
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Link not found' });
    }
    
    // Also delete any opened_links entries for this link (cleanup)
    await openedLinksCollection.deleteMany({ linkId: new ObjectId(linkId) });
    
    res.json({ 
      message: 'Link deleted successfully',
      deletedId: linkId
    });
  } catch (error) {
    console.error('Error deleting link:', error);
    res.status(500).json({ error: 'Failed to delete link' });
  }
});

// Optional: Get all opened links (for reference)
app.get('/api/opened-links', async (req, res) => {
  try {
    const openedLinks = await openedLinksCollection.find({}).toArray();
    res.json(openedLinks);
  } catch (error) {
    console.error('Error fetching opened links:', error);
    res.status(500).json({ error: 'Failed to fetch opened links' });
  }
});

// Start server
connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
