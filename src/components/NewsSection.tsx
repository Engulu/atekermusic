import { Eye, Heart, Share2 } from 'lucide-react';
import type { NewsArticle } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface NewsCardProps {
  article: NewsArticle;
}

function NewsCard({ article }: NewsCardProps) {
  return (
    <article className="bg-navy-800 rounded-lg overflow-hidden hover:scale-[1.01] transition">
      {article.imageUrl && (
        <img 
          src={article.imageUrl} 
          alt={article.title} 
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-6">
        <h3 className="text-xl font-semibold text-white mb-2">
          {article.title}
        </h3>
        <p className="text-gray-400 text-sm mb-4">
          {article.summary}
        </p>
        
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-gray-400">
              <Eye className="w-4 h-4" />
              {article.readCount}
            </span>
            <button className="flex items-center gap-1 text-red-400 hover:text-red-300">
              <Heart className="w-4 h-4" />
              {article.likeCount}
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            <button className="text-blue-400 hover:text-blue-300">
              <Share2 className="w-4 h-4" />
            </button>
            <span className="text-gray-500">
              {formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function NewsSection() {
  const latestNews: NewsArticle[] = [
    {
      id: '1',
      title: 'Upcoming Teso Music Festival',
      summary: 'Join us for the biggest celebration of Teso music and culture this summer.',
      content: '',
      imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2070',
      authorId: '1',
      authorName: 'James Okello',
      likeCount: 45,
      readCount: 123,
      createdAt: new Date().toISOString(),
      isPublished: true
    },
    {
      id: '2',
      title: 'New Album Release: Etop Lokaala',
      summary: 'Sarah Apio drops her highly anticipated second album featuring collaborations with top artists.',
      content: '',
      imageUrl: 'https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?q=80&w=2070',
      authorId: '2',
      authorName: 'Mary Akol',
      likeCount: 67,
      readCount: 234,
      createdAt: new Date().toISOString(),
      isPublished: true
    }
  ];

  return (
    <section className="py-16 bg-gradient-to-b from-navy-900 to-navy-800">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-3xl font-bold text-white">Latest News</h2>
          <a href="/news" className="text-blue-400 hover:text-blue-300">
            View All News →
          </a>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {latestNews.map(article => (
            <NewsCard key={article.id} article={article} />
          ))}
        </div>
      </div>
    </section>
  );
}