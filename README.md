# TikTok Creator Live Card

A real-time TikTok creator profile viewer built with Next.js, Puppeteer, and Lynx animations. This application allows you to view TikTok creator profiles with live-updating follower counts and profile information, enhanced with native-like animations.

## Features

- Real-time profile data scraping using Puppeteer
- Beautiful, responsive UI with Tailwind CSS
- Live follower count updates with Lynx animations
- Native-like transitions and interactions
- Smooth grid animations for content display
- Profile information display (username, bio, avatar)
- Error handling and loading states

## Tech Stack

- Next.js 13+ (App Router)
- TypeScript
- Tailwind CSS
- Puppeteer for web scraping
- React for UI components
- Lynx Animation System:
  - Custom animation hooks for follower counts
  - Grid layout animations
  - Native-like transitions
  - Performance-optimized rendering
  - Intersection Observer integration

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
│   ├── lynx-components/  # Custom Lynx animations and hooks
│   └── types/           # TypeScript type definitions
├── public/              # Static assets
└── package.json         # Project dependencies
```

## Lynx Integration

The project showcases several Lynx animation features:

1. **Follower Count Animations**
   - Smooth number transitions
   - Native-like easing functions
   - Optimized performance

2. **Grid Animations**
   - Fluid content transitions
   - Responsive layout animations
   - Intersection-based loading

3. **UI Interactions**
   - Native-feeling feedback
   - Smooth state transitions
   - Gesture-based animations

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License. 