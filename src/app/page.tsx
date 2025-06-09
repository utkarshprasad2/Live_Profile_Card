'use client';

import { useState } from 'react';
import CreatorCard from '@/components/CreatorCard';

export default function Home() {
  const [username, setUsername] = useState('');
  const [searchedUsername, setSearchedUsername] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchedUsername(username);
  };

  return (
    <main className="min-h-screen p-8 bg-gray-100">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">
          TikTok Creator Live Card
        </h1>
        
        <form onSubmit={handleSubmit} className="mb-8 flex justify-center gap-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter TikTok username"
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FE2C55] focus:border-transparent"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-[#FE2C55] text-white rounded-lg font-semibold hover:bg-[#E62B51] transition-colors"
          >
            Search
          </button>
        </form>

        {searchedUsername && <CreatorCard username={searchedUsername} />}
      </div>
    </main>
  );
} 