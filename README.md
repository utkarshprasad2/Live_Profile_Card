# TikTok Creator Live Card

A real-time TikTok creator profile viewer built with Next.js and Puppeteer. This application allows you to view TikTok creator profiles with live-updating follower counts and profile information.

## Features

- Real-time profile data scraping using Puppeteer
- Beautiful, responsive UI with Tailwind CSS
- Live follower count updates
- Profile information display (username, bio, avatar)
- Error handling and loading states

## Tech Stack

- Next.js 13+ (App Router)
- TypeScript
- Tailwind CSS
- Puppeteer for web scraping
- React for UI components

## Getting Started

1. Clone the repository:
```bash
git clone https://github.com/utkarshprasad2/Live_Profile_Card.git
cd Live_Profile_Card
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Project Structure

```
├── src/
│   ├── app/              # Next.js app router
│   ├── components/       # React components
│   ├── services/         # API and scraping services
│   └── types/           # TypeScript type definitions
├── public/              # Static assets
└── package.json         # Project dependencies
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. 