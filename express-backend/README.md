# Link Manager - Express Backend (Local Development)

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your MongoDB connection string
```

### 3. Start Server
```bash
npm start
```

Server runs at: `http://localhost:3001`

## Development Mode
```bash
npm run dev
```
Uses nodemon for auto-restart on file changes.

## API Endpoints

### GET /api/links
Get all unread links

**Response:**
```json
[
  {
    "_id": "...",
    "url": "https://x.com/elonmusk",
    "username": "elonmusk",
    "userId": null
  }
]
```

### POST /api/links
Create a new link

**Request:**
```json
{
  "url": "https://x.com/elonmusk",
  "username": "elonmusk",
  "userId": null
}
```

**Response:**
```json
{
  "message": "Link created successfully",
  "link": { ... }
}
```

### POST /api/links/:id/mark-opened
Mark a link as opened

**Response:**
```json
{
  "message": "Link marked as opened",
  "result": { ... }
}
```

### PUT /api/links/:id
Update a link

**Request:**
```json
{
  "url": "https://x.com/new-url",
  "username": "newusername"
}
```

### DELETE /api/links/:id
Delete a link

**Response:**
```json
{
  "message": "Link deleted successfully",
  "deletedId": "..."
}
```

### GET /api/opened-links
Get all opened links

## Database

Uses MongoDB with two collections:
- `users` - Stores all links
- `opened_links` - Tracks which links have been opened

## Environment Variables

- `PORT` - Server port (default: 3001)
- `MONGODB_URI` - MongoDB connection string
- `DB_NAME` - Database name (default: linksdb)
- `LINKS_COLLECTION` - Collection for links (default: users)
- `OPENED_LINKS_COLLECTION` - Collection for opened links (default: opened_links)

## Testing

```bash
# Test server is running
curl http://localhost:3001/api/links

# Add a link
curl -X POST http://localhost:3001/api/links \
  -H "Content-Type: application/json" \
  -d '{"url": "https://x.com/jack", "username": "jack"}'
```

## For Production

Use the serverless backend instead - see `../serverless-backend/`
