/**
 * Database Initialization Script
 * 
 * This script helps initialize your MongoDB database.
 * MongoDB automatically creates databases and collections on first write,
 * but this script helps test the connection and optionally create indexes.
 * 
 * Usage: npx tsx scripts/init-db.ts
 */

// Load environment variables FIRST using require (synchronous)
require('dotenv').config({ 
  path: require('path').resolve(process.cwd(), '.env.local') 
})

async function initDatabase() {
  try {
    // Dynamically import MongoDB after env vars are loaded
    const { getDb } = await import('../lib/mongodb')
    
    console.log('🔌 Connecting to MongoDB...')
    const db = await getDb()
    console.log('✅ Connected to MongoDB successfully!')
    console.log(`📦 Database name: ${db.databaseName}`)

    // Test collections (they will be created automatically on first write)
    const guestsCollection = db.collection('guests')
    const wishesCollection = db.collection('wishes')

    console.log('\n📊 Creating indexes for better performance...')

    // Create indexes for guests collection
    try {
      await guestsCollection.createIndex({ name: 1 }, { unique: false })
      await guestsCollection.createIndex({ createdAt: -1 })
      await guestsCollection.createIndex({ shortId: 1 }, { unique: true, sparse: true })
      console.log('✅ Indexes created for "guests" collection')
    } catch (error: any) {
      if (error.code !== 85) { // Index already exists
        console.log('⚠️  Index creation for "guests" skipped:', error.message)
      }
    }

    // Create indexes for wishes collection
    try {
      await wishesCollection.createIndex({ createdAt: -1 })
      await wishesCollection.createIndex({ guestName: 1 })
      console.log('✅ Indexes created for "wishes" collection')
    } catch (error: any) {
      if (error.code !== 85) { // Index already exists
        console.log('⚠️  Index creation for "wishes" skipped:', error.message)
      }
    }

    // Test write operation (creates collections if they don't exist)
    console.log('\n🧪 Testing write operations...')
    
    const testGuest = {
      name: 'Test Guest (Delete Me)',
      invitationUrl: 'http://localhost:3000/?name=Test%20Guest',
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const result = await guestsCollection.insertOne(testGuest)
    console.log('✅ Test guest created:', result.insertedId)

    // Clean up test data
    await guestsCollection.deleteOne({ _id: result.insertedId })
    console.log('🧹 Test data cleaned up')

    console.log('\n✨ Database initialization complete!')
    console.log('\n📝 Collections will be created automatically when you:')
    console.log('   - Add your first guest via /admin')
    console.log('   - Receive your first wish submission')
    
    process.exit(0)
  } catch (error: any) {
    console.error('\n❌ Error initializing database:')
    console.error(error.message)
    
    if (error.message.includes('MONGODB_URI')) {
      console.error('\n💡 Make sure you have set MONGODB_URI in .env.local')
    } else if (error.message.includes('authentication')) {
      console.error('\n💡 Check your MongoDB username and password')
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('ECONNREFUSED')) {
      console.error('\n💡 Check your MongoDB connection string and network access')
    }
    
    process.exit(1)
  }
}

initDatabase()

