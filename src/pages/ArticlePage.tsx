import { useParams } from 'react-router-dom';
import { Eye, Heart, Share2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { NewsArticle } from '../types';

export default function ArticlePage() {
  const { id } = useParams();

  // In a real app, fetch the article from your backend
  const article: NewsArticle | undefined = {
    id: '1',
    title: 'Teso Cultural Festival Set for June 2024',
    summary: 'The annual Teso Cultural Festival will feature traditional music performances.',
    content: `
      The highly anticipated Teso Cultural Festival is set to take place this June, bringing together artists, musicians, and cultural enthusiasts from across the region. The festival, now in its 10th year, promises to be a spectacular celebration of Teso heritage and traditions.

      This year's festival will feature:
      
      - Traditional Akogo performances by master musicians
      - Modern interpretations of classic Teso songs
      - Dance competitions showcasing regional styles
      - Cultural exhibitions and workshops
      - Local food and craft vendors
      
      The event will be held at the Soroti Stadium from June 15-17, 2024, with performances scheduled throughout each day. Organizers expect over 10,000 attendees from Uganda and neighboring countries.

      "This festival is not just about entertainment; it's about preserving our cultural heritage and passing it on to the next generation," says festival organizer James Okello. "We're especially excited about the youth participation this year, with many young artists incorporating traditional elements into contemporary music styles."

      Tickets are available online and at selected outlets across major towns in the Teso region. Early bird discounts are available until April 30th.
    `,
    imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=2070',
    authorId: '1',
    authorName: 'James Okello',
    likeCount: 145,
    readCount: 523,
    createdAt: new Date().toISOString(),
    isPublished: true,
    category: 'local'
  };

  if (!article) {
    return (
      <div className="min-h-screen bg-navy-900 pt-24 pb-16">
        <div className="container mx-auto px-4">
          <p className="text-white">Article not found</p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-navy-900 pt-24 pb-16">
      <article className="container mx-auto px-4 max-w-4xl">
        <img 
          src={article.imageUrl} 
          alt={article.title}
          className="w-full h-[400px] object-cover rounded-lg mb-8"
        />

        <h1 className="text-4xl font-bold text-white mb-4">
          {article.title}
        </h1>

        <div className="flex items-center justify-between mb-8 text-sm">
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

        <div className="prose prose-invert max-w-none">
          {article.content.split('\n').map((paragraph, index) => (
            <p key={index} className="text-gray-300 mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      </article>
    </main>
  );
}