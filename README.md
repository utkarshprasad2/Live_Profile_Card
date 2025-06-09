# TikTok Creator Live Card 📱

A real-time, data-driven web application that displays live TikTok creator profiles in an elegant and interactive card format. This project showcases modern web development practices, real-time data handling, and polished UI/UX design.

## 🌟 Features

- **Live Data Integration**: Real-time fetching of TikTok creator statistics
- **Dynamic Profile Cards**: Beautifully designed cards displaying:
  - Profile image and display name
  - Live follower count with smooth animations
  - Total likes count
  - Recent videos grid with expandable view
  - Direct follow button linking to creator's profile
- **Responsive Design**: Mobile-first approach ensuring perfect display across all devices
- **Real-time Updates**: Automatic refresh of creator statistics
- **Search Functionality**: Easy creator lookup through username

## 🛠️ Tech Stack

- **Frontend Framework**: React 18 with TypeScript
- **Styling**: 
  - Tailwind CSS for utility-first styling
  - Framer Motion for smooth animations
- **State Management**: 
  - React Query for server state
  - Zustand for client state
- **API Integration**:
  - TikTok API integration via RapidAPI
  - Axios for HTTP requests
- **Development Tools**:
  - Vite for fast development and building
  - ESLint & Prettier for code quality
  - Husky for git hooks

## 📦 Prerequisites

- Node.js (v18 or higher)
- npm or yarn
- RapidAPI account with TikTok API subscription

## 🚀 Getting Started

1. Clone the repository:
```bash
git clone https://github.com/yourusername/tiktok-creator-live-card.git
cd tiktok-creator-live-card
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_RAPIDAPI_KEY=your_api_key_here
VITE_RAPIDAPI_HOST=your_api_host_here
```

4. Start the development server:
```bash
npm run dev
```

## 🏗️ Project Structure

```
src/
├── components/         # Reusable UI components
├── hooks/             # Custom React hooks
├── services/          # API and external service integrations
├── store/             # State management
├── types/             # TypeScript type definitions
├── utils/             # Helper functions and utilities
└── pages/             # Main application pages
```

## 🔄 API Integration

The application uses the TikTok Profile Data API from RapidAPI to fetch creator information. Key endpoints include:
- User Profile Data
- User Statistics
- Recent Videos

## 🎨 UI/UX Features

- Smooth animations for count updates
- Skeleton loading states
- Error handling with user-friendly messages
- Responsive grid layout for video thumbnails
- Interactive hover states and transitions

## 📱 Responsive Design

The application follows a mobile-first approach with breakpoints at:
- Mobile: 320px+
- Tablet: 768px+
- Desktop: 1024px+

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- TikTok for inspiration
- RapidAPI for providing TikTok data access
- The open-source community for amazing tools and libraries 