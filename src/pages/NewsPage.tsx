import { useState, useCallback } from 'react';
import { Search, Eye, Heart, Share2, Trophy, Globe2, Film, GraduationCap, Vote } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { Link } from 'react-router-dom';
import type { NewsArticle } from '../types';

type NewsCategory = 'all' | 'local' | 'international' | 'entertainment' | 'football' | 'politics' | 'education';

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState<NewsCategory>('all');

  const categories = [
    { id: 'all', name: 'All News', icon: Globe2 },
    { id: 'local', name: 'Local News', icon: Globe2 },
    { id: 'international', name: 'International', icon: Globe2 },
    { id: 'entertainment', name: 'Entertainment', icon: Film },
    { id: 'football', name: 'Football', icon: Trophy },
    { id: 'politics', name: 'Politics', icon: Vote },
    { id: 'education', name: 'Education', icon: GraduationCap }
  ];

  const articles: NewsArticle[] = [
    // Local News
    {
      id: '1',
      title: 'Teso Cultural Festival Set for June 2024',
      summary: 'The annual Teso Cultural Festival will feature traditional music performances, including Akogo and Ajosi, celebrating the rich heritage of the region.',
      imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2070',
      authorId: '1',
      authorName: 'James Okello',
      likeCount: 145,
      readCount: 523,
      createdAt: new Date().toISOString(),
      isPublished: true,
      category: 'local'
    },
    // International News
    {
      id: '2',
      title: 'Grammy Awards Adds New Category for African Traditional Music',
      summary: 'The Recording Academy announces new award category celebrating African traditional music, opening doors for artists worldwide.',
      imageUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=2070',
      authorId: '2',
      authorName: 'Mary Akol',
      likeCount: 267,
      readCount: 834,
      createdAt: new Date().toISOString(),
      isPublished: true,
      category: 'international'
    },
    // Entertainment News
    {
      id: '3',
      title: 'Eddy Kenzo Announces Collaboration with Teso Artists',
      summary: 'BET Award winner Eddy Kenzo reveals upcoming project featuring prominent Teso musicians, bridging traditional and modern sounds.',
      imageUrl: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=2070',
      authorId: '3',
      authorName: 'Peter Omoding',
      likeCount: 389,
      readCount: 945,
      createdAt: new Date().toISOString(),
      isPublished: true,
      category: 'entertainment'
    },
    // Football News
    {
      id: '4',
      title: 'KCCA FC Signs Rising Star from Soroti Soccer Academy',
      summary: 'Kampala Capital City Authority FC has completed the signing of promising young striker from Soroti Soccer Academy in a landmark deal.',
      imageUrl: 'https://images.unsplash.com/photo-1517466787929-bc90951d0974?q=80&w=2070',
      authorId: '4',
      authorName: 'Michael Erimu',
      likeCount: 234,
      readCount: 678,
      createdAt: new Date().toISOString(),
      isPublished: true,
      category: 'football'
    },
    // Politics
    {
      id: '5',
      title: 'Parliament Passes New Arts and Culture Funding Bill',
      summary: 'Ugandan Parliament approves new legislation to support traditional arts and music, allocating significant funding for cultural preservation.',
      imageUrl: 'https://images.unsplash.com/photo-1604580864964-0462f5d5b1a8?q=80&w=2070',
      authorId: '5',
      authorName: 'Sarah Apolot',
      likeCount: 156,
      readCount: 567,
      createdAt: new Date().toISOString(),
      isPublished: true,
      category: 'politics'
    },
    // Education
    {
      id: '6',
      title: 'Music Education Program Launched in Teso Schools',
      summary: 'New initiative introduces traditional music education in primary schools across Teso region, preserving cultural heritage through early education.',
      imageUrl: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=2070',
      authorId: '6',
      authorName: 'John Okiror',
      likeCount: 178,
      readCount: 456,
      createdAt: new Date().toISOString(),
      isPublished: true,
      category: 'education',
      content: 'Extended article content here...'
    },
    {
      id: '7',
      title: 'Champions League: Bayern Munich vs Arsenal Preview',
      summary: 'Comprehensive analysis and predictions for the upcoming Champions League quarter-final clash.',
      imageUrl: 'https://images.unsplash.com/photo-1522778119026-d647f0596c20?q=80&w=2070',
      authorId: '7',
      authorName: 'David Okello',
      likeCount: 234,
      readCount: 789,
      createdAt: new Date().toISOString(),
      isPublished: true,
      category: 'football'
    },
    {
      id: '8',
      title: 'Premier League Title Race Heats Up',
      summary: 'Arsenal, Manchester City, and Liverpool locked in intense battle for Premier League glory with just 8 games remaining.',
      imageUrl: 'https://images.unsplash.com/photo-1577223625816-6500cc0ab721?q=80&w=2070',
      authorId: '8',
      authorName: 'Sarah Atim',
      likeCount: 456,
      readCount: 1234,
      createdAt: new Date().toISOString(),
      isPublished: true,
      category: 'football'
    }
  ];

  return (
    <main className="min-h-screen bg-navy-900 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Latest News</h1>
            <p className="text-gray-400">Stay updated with the latest in Teso music</p>
          </div>

          <div className="relative max-w-md w-full">
            <input
              type="text"
              placeholder="Search news..."
              className="w-full px-12 py-3 bg-navy-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          </div>
        </div>

        {/* Categories */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-4 pb-4">
            {categories.map(category => {
              const Icon = category.icon;
              return (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id as NewsCategory)}
                  className={`flex items-center gap-2 px-6 py-2 rounded-full whitespace-nowrap transition ${
                    selectedCategory === category.id
                      ? 'bg-blue-500 text-white'
                      : 'bg-navy-800 text-gray-400 hover:bg-navy-700'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{category.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 gap-8">
          {articles
            .filter(article => selectedCategory === 'all' || article.category === selectedCategory)
            .map(article => (
            <article
              key={article.id}
              className="bg-navy-800 rounded-lg overflow-hidden hover:scale-[1.01] transition"
            >
              {article.imageUrl && (
                <img 
                  src={article.imageUrl} 
                  alt={article.title} 
                  className="w-full h-64 object-cover"
                />
              )}
              <div className="p-6">
                <h3 className="text-2xl font-semibold text-white mb-2">
                  {article.title}
                </h3>
                <p className="text-gray-400 mb-2">
                  {article.summary}
                </p>
                <Link 
                  to={`/news/${article.id}`}
                  className="inline-block text-blue-400 hover:text-blue-300 mb-4"
                >
                  Read more →
                </Link>
                
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-6">
                    <span className="flex items-center gap-1 text-gray-400">
                      <Eye className="w-4 h-4" />
                      {article.readCount}
                    </span>
                    <button className="flex items-center gap-1 text-red-400 hover:text-red-300">
                      <Heart className="w-4 h-4" />
                      {article.likeCount}
                    </button>
                    <button className="text-blue-400 hover:text-blue-300">
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-4 text-gray-400">
                    <span>{article.authorName}</span>
                    <span>•</span>
                    <span>{formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })}</span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* Football Predictions Link */}
        {selectedCategory === 'football' && (
          <div className="mt-8 bg-navy-800 rounded-lg p-6 text-center">
            <h3 className="text-xl font-semibold text-white mb-4">Looking for Football Predictions?</h3>
            <p className="text-gray-400 mb-6">Get expert predictions and analysis for upcoming matches</p>
            <Link
              to="/predictions"
              className="inline-block px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              View Predictions →
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}