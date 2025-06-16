# TikTok Profile Card

A modern web application to view TikTok profiles and analyze performance metrics.

## Environment Setup

1. Create a `.env.local` file in the root directory
2. Add the following environment variables:

```bash
# TikTok API Configuration
NEXT_PUBLIC_TIKTOK_CLIENT_KEY=your_client_key_here
TIKTOK_CLIENT_SECRET=your_client_secret_here
TIKTOK_ACCESS_TOKEN=your_access_token_here

# Optional - if using refresh tokens
TIKTOK_REFRESH_TOKEN=your_refresh_token_here
```

## TikTok API Setup

1. Go to [TikTok for Developers](https://developers.tiktok.com/)
2. Create a new app or use an existing one
3. Enable the following products:
   - Login Kit
   - Display API
4. Request the following scopes:
   - `user.info.basic`
   - `video.list`
5. Add your development URLs to the allowed domains
6. Copy your Client Key and Client Secret to the `.env.local` file

## Security Notes

- Never commit the `.env.local` file to version control
- The `.gitignore` file is configured to exclude sensitive files
- Use environment variables in production deployment
- Rotate your API keys regularly
- Store the refresh token securely
- Use HTTPS in production

## Development

1. Install dependencies:
```bash
npm install
```

2. Run the development server:
```bash
npm run dev
```

3. Open [http://localhost:3000](http://localhost:3000) in your browser

## API Documentation

The application uses TikTok's Display API to fetch:
- User profiles
- Video lists
- Video details

For more information, see the [TikTok Display API Documentation](https://developers.tiktok.com/doc/display-api-get-started/).

## Features

- Display user profile information
- Show recent TikTok videos
- Analyze video performance
- Responsive design
- Secure API key handling
