import { Article } from '@/lib/supabase';
import { Card } from './ui/card';
import { Calendar, Clock, User, Tag } from 'lucide-react';
import { Link } from 'wouter';

interface NewsCardProps {
  article: Article;
  featured?: boolean;
}

/**
 * Calculate reading time based on content length
 * Average reading speed: 200 words per minute
 */
function calculateReadingTime(body: string): number {
  const wordsPerMinute = 200;
  const wordCount = body.trim().split(/\s+/).length;
  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return minutes;}

/**
 * Format date for display
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

/**
 * Get category color
 */
function getCategoryColor(category: string): string {
  const colors: Record<string, string> = {
    Teso: 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20',
    National: 'bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20',
    'East Africa': 'bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20',
    Africa: 'bg-orange-500/10 text-orange-600 dark:text-orange-400 border-orange-500/20',
    International: 'bg-pink-500/10 text-pink-600 dark:text-pink-400 border-pink-500/20',
    Football: 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20',
  };
  return colors[category] || 'bg-muted text-muted-foreground border-border';
}

export default function NewsCard({ article, featured = false }: NewsCardProps) {
  const readingTime = calculateReadingTime(article.body);

  if (featured) {
    return (
      <Link href={`/article/${article.id}`}>
        <Card className="overflow-hidden hover:shadow-2xl transition-all duration-300 border-border/50 hover:border-primary/30 cursor-pointer group">
          <div className="grid md:grid-cols-2 gap-0">
            {/* Featured Image */}
            <div className="relative h-64 md:h-full bg-gradient-to-br from-primary/20 to-primary/5 overflow-hidden">
            {article.cover_url ? (
              <img
                src={article.cover_url}
                  alt={article.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <Tag className="w-20 h-20 text-primary/40" />
                </div>
              )}
              
              {/* Category Badge */}
              <div className="absolute top-4 left-4">
                <span className={`px-4 py-2 rounded-full text-sm font-semibold backdrop-blur-sm border ${getCategoryColor(article.category)}`}>
                  {article.category}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-8 flex flex-col justify-between">
              <div>
                <h2 className="text-3xl font-bold text-card-foreground mb-4 line-clamp-3 group-hover:text-primary transition-colors">
                  {article.title}
                </h2>
                <p className="text-muted-foreground text-lg mb-6 line-clamp-3">
                  {article.excerpt || article.body.substring(0, 200) + '...'}
                </p>
              </div>

              {/* Metadata */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                <span className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {article.author?.display_name || 'Ateker Music'}
                </span>
                <span className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  {formatDate(article.created_at)}
                </span>
                <span className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  {readingTime} min read
                </span>
              </div>
            </div>
          </div>
        </Card>
      </Link>
    );
  }

  return (
    <Link href={`/article/${article.id}`}>
      <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 border-border/50 hover:border-primary/30 cursor-pointer group h-full flex flex-col">
        {/* Image */}
        <div className="relative h-48 bg-gradient-to-br from-primary/20 to-primary/5 overflow-hidden">
          {article.cover_url ? (
            <img
              src={article.cover_url}
              alt={article.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Tag className="w-16 h-16 text-primary/40" />
            </div>
          )}
          
          {/* Category Badge */}
          <div className="absolute top-3 left-3">
            <span className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm border ${getCategoryColor(article.category)}`}>
              {article.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col flex-1">
          <h3 className="text-xl font-bold text-card-foreground mb-3 line-clamp-2 group-hover:text-primary transition-colors">
            {article.title}
          </h3>
          <p className="text-muted-foreground mb-4 line-clamp-3 flex-1">
            {article.excerpt || article.body.substring(0, 150) + '...'}
          </p>

          {/* Metadata */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground pt-4 border-t border-border">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5" />
              {formatDate(article.created_at)}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              {readingTime} min
            </span>
          </div>
        </div>
      </Card>
    </Link>
  );
}
