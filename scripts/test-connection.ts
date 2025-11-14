/**
 * Simple MongoDB Connection Test
 * 
 * Quick script to test if your MongoDB connection is working.
 * 
 * Usage: npx tsx scripts/test-connection.ts
 */

// Load environment variables FIRST using require (synchronous)
require('dotenv').config({ 
  path: require('path').resolve(process.cwd(), '.env.local') 
})

async function testConnection() {
  try {
    // Dynamically import MongoDB after env vars are loaded
    const { default: clientPromise } = await import('../lib/mongodb')
    
    console.log('🔌 Testing MongoDB connection...')
    const client = await clientPromise
    const adminDb = client.db().admin()
    
    // Ping the database
    await adminDb.ping()
    console.log('✅ MongoDB connection successful!')
    
    // Get database info
    const db = client.db(process.env.MONGODB_DB_NAME || 'wedding')
    const collections = await db.listCollections().toArray()
    
    console.log(`\n📦 Database: ${db.databaseName}`)
    console.log(`📊 Collections: ${collections.length}`)
    
    if (collections.length > 0) {
      console.log('\nExisting collections:')
      collections.forEach(col => {
        console.log(`  - ${col.name}`)
      })
    } else {
      console.log('\n💡 No collections yet. They will be created automatically on first use.')
    }
    
    process.exit(0)
  } catch (error: any) {
    console.error('\n❌ Connection failed!')
    console.error('Error:', error.message)
    
    if (error.message.includes('MONGODB_URI')) {
      console.error('\n💡 Make sure MONGODB_URI is set in .env.local')
    } else if (error.message.includes('authentication')) {
      console.error('\n💡 Authentication failed. Check your username and password.')
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('\n💡 Cannot reach MongoDB server. Check your connection string.')
    } else if (error.message.includes('IP')) {
      console.error('\n💡 Your IP address may not be whitelisted in MongoDB Atlas.')
    }
    
    process.exit(1)
  }
}

testConnection()

