export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow GET
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { username } = req.query;

    if (!username) {
      return res.status(400).json({ error: 'Username is required' });
    }

    // Clean username (remove @ if present)
    const cleanUsername = username.replace('@', '');

    // Fetch the X profile page
    const profileUrl = `https://x.com/${cleanUsername}`;
    
    try {
      const response = await fetch(profileUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      
      if (!response.ok) {
        return res.status(404).json({ 
          error: 'Profile not found',
          username: cleanUsername 
        });
      }

      const html = await response.text();
      
      // Try multiple patterns to extract user ID
      // Pattern 1: rest_id in JSON
      let userIdMatch = html.match(/"rest_id":"(\d+)"/);
      
      // Pattern 2: Alternative format
      if (!userIdMatch) {
        userIdMatch = html.match(/"id_str":"(\d+)"/);
      }
      
      // Pattern 3: user_id in meta tags
      if (!userIdMatch) {
        userIdMatch = html.match(/twitter:site:id" content="(\d+)"/);
      }

      const userId = userIdMatch ? userIdMatch[1] : null;

      if (!userId) {
        // Return username even if user ID not found
        return res.status(200).json({
          username: cleanUsername,
          userId: null,
          profileUrl,
          note: 'User ID could not be extracted'
        });
      }

      return res.status(200).json({
        username: cleanUsername,
        userId,
        profileUrl
      });

    } catch (fetchError) {
      console.error('Error fetching profile:', fetchError);
      
      // Return basic info even if fetch fails
      return res.status(200).json({
        username: cleanUsername,
        userId: null,
        profileUrl,
        error: 'Could not fetch profile data'
      });
    }

  } catch (error) {
    console.error('Error in get-user-id:', error);
    return res.status(500).json({ error: 'Failed to process request' });
  }
}
