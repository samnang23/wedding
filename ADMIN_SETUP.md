# Admin Panel Setup Guide

This guide explains how to set up and use the admin panel for managing wedding guests and viewing wishes.

## 🚀 Setup

### 1. MongoDB Configuration

The `.env.local` file has already been created with sample values. Update it with your MongoDB connection string:

```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
MONGODB_DB_NAME=wedding
NEXT_PUBLIC_BASE_URL=https://your-domain.com
```

**Note:** 
- `MONGODB_URI` is required - get this from your MongoDB Atlas account or local MongoDB instance
- `MONGODB_DB_NAME` is optional (defaults to 'wedding')
- `NEXT_PUBLIC_BASE_URL` is optional - will use Vercel URL automatically if deployed

### 2. Test MongoDB Connection

**MongoDB doesn't require migrations like Laravel!** Databases and collections are created automatically on first write.

However, you can test your connection first:

```bash
# Test if MongoDB connection works
pnpm db:test

# Initialize database (creates indexes, tests connection)
pnpm db:init
```

These scripts will help you:
- ✅ Verify your MongoDB connection is working
- ✅ Create performance indexes (optional but recommended)
- ✅ Test that everything is set up correctly

### 3. MongoDB Atlas Setup (Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP address (or use `0.0.0.0/0` for all IPs - not recommended for production)
5. Get your connection string and add it to `.env.local`

### 4. Install Dependencies

Dependencies are already installed, but if needed:

```bash
pnpm install
```

### 5. Troubleshooting Connection Issues

If you see 500 errors in the API:

1. **Test your connection:**
   ```bash
   pnpm db:test
   ```

2. **Common issues:**
   - ❌ **"MONGODB_URI not set"** → Check your `.env.local` file
   - ❌ **"Authentication failed"** → Check username/password in connection string
   - ❌ **"ENOTFOUND"** → Check your connection string URL
   - ❌ **"IP not whitelisted"** → Add your IP to MongoDB Atlas Network Access

3. **Check error details:**
   - In development mode, API errors include detailed error messages
   - Check your terminal/console for full error logs

## 📍 Admin Panel Access

Navigate to: `/admin`

Example: `http://localhost:3000/admin` or `https://your-domain.com/admin`

## 🎯 Features

### Guest Management

- **Add Guests**: Click "Add Guest" to create a new distinguished guest
- **Edit Guests**: Click the edit icon to modify guest information
- **Delete Guests**: Click the delete icon to remove a guest
- **Copy Invitation URL**: Click the copy icon to copy the personalized invitation link
- **View All Guests**: See all guests in a table with their invitation URLs

### Wishes Management

- **View Wishes**: See all wishes submitted by guests
- **Filter by Guest**: Wishes show which guest (if any) submitted them
- **View Details**: See guest name, message, number of guests, and submission date

## 🔗 How Invitation URLs Work

When you add a guest, the system automatically generates a personalized invitation URL:

```
https://your-domain.com/?name=Guest%20Name
```

The guest name is URL-encoded, so it works with Khmer characters and special characters.

**Example:**
- Guest Name: `លោក លី ម៉ុងស`
- Generated URL: `https://your-domain.com/?name=%E1%9E%9B%E1%9F%84%E1%9E%80%20%E1%9E%9B%E1%9E%B8%20%E1%9E%89%E1%9E%8F%E1%9E%84%E1%9E%9F%E1%9E%9F`

## 📊 API Endpoints

### Guests API

- `GET /api/guests` - Get all guests
- `POST /api/guests` - Create a new guest
- `GET /api/guests/[id]` - Get a specific guest
- `PUT /api/guests/[id]` - Update a guest
- `DELETE /api/guests/[id]` - Delete a guest

### Wishes API

- `GET /api/wishes` - Get all wishes (supports `?limit=50&skip=0` query params)
- `POST /api/wishes` - Create a new wish

## 💾 Database Collections

The system uses two MongoDB collections:

1. **`guests`** - Stores distinguished guest information
   ```typescript
   {
     _id: ObjectId,
     name: string,
     invitationUrl: string,
     createdAt: Date,
     updatedAt: Date
   }
   ```

2. **`wishes`** - Stores guest wishes/messages
   ```typescript
   {
     _id: ObjectId,
     name: string,
     message: string,
     guests: number,
     guestName?: string, // The name from invitation URL
     createdAt: Date
   }
   ```

## 🔒 Security Considerations

**Important:** The admin panel currently has no authentication. For production use, you should:

1. Add authentication (e.g., NextAuth.js)
2. Protect the `/admin` route
3. Protect API routes with authentication middleware
4. Add rate limiting to API endpoints
5. Validate and sanitize all inputs

## 🛠️ Troubleshooting

### MongoDB Connection Issues

- Verify your `MONGODB_URI` is correct
- Check that your IP is whitelisted in MongoDB Atlas
- Ensure the database user has read/write permissions
- Check network connectivity

### Invitation URLs Not Working

- Verify `NEXT_PUBLIC_BASE_URL` is set correctly
- On Vercel, the URL is automatically detected
- Ensure the URL is properly encoded

### Wishes Not Appearing

- Check that wishes are being saved (check browser console)
- Verify MongoDB connection
- Check the `/api/wishes` endpoint directly

## 📝 Example Usage

1. **Add a Guest:**
   - Go to `/admin`
   - Click "Add Guest"
   - Enter guest name: `លោក លី ម៉ុងស`
   - Click "Create"
   - Copy the generated invitation URL

2. **Share Invitation:**
   - Copy the invitation URL
   - Send via WhatsApp, Email, SMS, or generate a QR code
   - Guest clicks link and sees personalized invitation

3. **View Wishes:**
   - Go to `/admin`
   - Click "Wishes" tab
   - See all submitted wishes with guest information

## 🎨 Customization

The admin panel uses the same design system as the wedding site. You can customize:

- Colors in `app/admin/page.tsx`
- Layout and styling
- Add additional fields to guests or wishes
- Add filtering and search functionality

