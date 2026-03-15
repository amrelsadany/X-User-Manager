// migrate-in-place.js
// Migrates existing documents in-place without creating new collections
// Updates 'users' collection to match serverless schema

require('dotenv').config();
const { MongoClient, ObjectId } = require('mongodb');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = process.env.DB_NAME || 'linksdb';

async function migrate() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    console.log(`📊 Database: ${DB_NAME}\n`);
    
    const db = client.db(DB_NAME);
    const usersCollection = db.collection('Users');
    const openedLinksCollection = db.collection('OpenedLinks');
    
    // Step 1: Count existing documents
    const totalLinks = await usersCollection.countDocuments();
    const totalOpened = await openedLinksCollection.countDocuments();
    
    console.log('📋 Current State:');
    console.log(`  - Documents in 'users' collection: ${totalLinks}`);
    console.log(`  - Documents in 'opened_links' collection: ${totalOpened}\n`);
    
    if (totalLinks === 0) {
      console.log('⚠️  No documents to migrate. Exiting.');
      return;
    }
    
    // Step 2: Get all opened link IDs
    const openedLinks = await openedLinksCollection.find({}).toArray();
    const openedLinkIds = new Set(
      openedLinks.map(link => link.linkId.toString())
    );
    console.log(`📖 Opened links: ${openedLinkIds.size}\n`);
    
    // Step 3: Update each document in-place
    console.log('🔄 Starting migration...\n');
    
    const cursor = usersCollection.find({});
    let updated = 0;
    let skipped = 0;
    
    while (await cursor.hasNext()) {
      const doc = await cursor.next();
      
      // Check if already migrated (has isRead field)
      if (doc.hasOwnProperty('isRead')) {
        console.log(`  ⏭️  Skipped: ${doc.url} (already migrated)`);
        skipped++;
        continue;
      }
      
      // Determine if this link was opened
      const isRead = openedLinkIds.has(doc._id.toString());
      
      // Build update object with new fields
      const updateFields = {
        isRead: isRead,
        createdAt: doc.createdAt || new Date(),
        title: doc.title || (doc.username ? `@${doc.username}` : ''),
        username: doc.username || '',
        userId: doc.userId || ''
      };
      
      // Update the document in-place
      await usersCollection.updateOne(
        { _id: doc._id },
        { $set: updateFields }
      );
      
      updated++;
      console.log(`  ✅ Updated: ${doc.url} (isRead: ${isRead})`);
    }
    
    // Step 4: Rename collection from 'users' to 'links' (optional)
    console.log('\n🔄 Renaming collection...');
    
    try {
      // Check if 'links' collection already exists
      const collections = await db.listCollections({ name: 'links' }).toArray();
      
      if (collections.length > 0) {
        console.log('⚠️  Collection "links" already exists. Skipping rename.');
        console.log('   Current collection name remains: "users"');
      } else {
        // Rename 'users' to 'links'
        await usersCollection.rename('links');
        console.log('✅ Renamed "users" collection to "links"');
      }
    } catch (error) {
      console.log('⚠️  Could not rename collection:', error.message);
      console.log('   Collection remains as "users" (this is fine)');
    }
    
    // Step 5: Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 Migration Summary:');
    console.log('='.repeat(50));
    console.log(`  Total documents: ${totalLinks}`);
    console.log(`  Updated: ${updated}`);
    console.log(`  Skipped (already migrated): ${skipped}`);
    console.log(`  Marked as read: ${Array.from(openedLinkIds).length}`);
    console.log(`  Marked as unread: ${updated - Array.from(openedLinkIds).length}`);
    console.log('='.repeat(50) + '\n');
    
    // Step 6: Ask about cleanup
    if (process.argv.includes('--cleanup')) {
      console.log('🗑️  Cleaning up "opened_links" collection...');
      await openedLinksCollection.drop();
      console.log('✅ "opened_links" collection deleted\n');
      
      console.log('✅ Migration complete! Old collection cleaned up.');
    } else {
      console.log('💡 Next steps:');
      console.log('  1. Verify your data looks correct');
      console.log('  2. Test your application');
      console.log('  3. When ready, delete old "opened_links" collection:');
      console.log('     Run: node migrate-in-place.js --cleanup\n');
      
      console.log('⚠️  Note: "opened_links" collection is no longer needed');
      console.log('   All read status is now stored in the "isRead" field\n');
    }
    
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  } finally {
    await client.close();
    console.log('👋 Disconnected from MongoDB');
  }
}

// Run migration
console.log('🚀 Link Manager - In-Place Migration Script');
console.log('='.repeat(50) + '\n');

migrate();
