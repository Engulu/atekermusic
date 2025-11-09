import { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Calendar, Eye, Heart, Newspaper } from 'lucide-react';
import { supabase, Article, NEWS_CATEGORIES } from '@/lib/supabase';
import { Link } from 'wouter';

export default function News() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    fetchArticles();
  }, [selectedCategory]);

  const fetchArticles = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('articles')
        .select(`
          *,
          author:profiles(*)
        `)
        .eq('published', true)
        .order('published_at', { ascending: false });

      if (selectedCategory !== 'all') {
        query = query.eq('category', selectedCategory);
      }

      const { data, error } = await query;

      if (error) throw error;
      setArticles(data || []);
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <Layout>
      <div className="container py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">News & Updates</h1>
          <p className="text-muted-foreground">
            Stay updated with the latest music news from Uganda and beyond
          </p>
        </div>

        {/* Category Filters */}
        <div className="flex flex-wrap gap-2 mb-8">
          <Button
            variant={selectedCategory === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory('all')}
          >
            All News
          </Button>
          {NEWS_CATEGORIES.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category ? 'default' : 'outline'}
              size="sm"
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Button>
          ))}
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading articles...</p>
          </div>
        ) : articles.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No articles found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {articles.map((article) => (
              <Link key={article.id} href={`/news/${article.slug}`}>
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full flex flex-col">
                  {/* Cover Image */}
                  <div className="aspect-video bg-muted relative overflow-hidden">
                    {article.cover_url ? (
                      <img
                        src={article.cover_url}
                        alt={article.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Newspaper className="w-12 h-12 text-muted-foreground" />
                      </div>
                    )}
                    {/* Category Badge */}
                    <div className="absolute top-3 left-3">
                      <span className="px-3 py-1 bg-primary text-primary-foreground text-xs font-medium rounded-full">
                        {article.category}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-4 flex-1 flex flex-col">
                    <h3 className="font-semibold text-lg text-card-foreground mb-2 line-clamp-2">
                      {article.title}
                    </h3>
                    
                    {article.excerpt && (
                      <p className="text-sm text-muted-foreground line-clamp-3 mb-4">
                        {article.excerpt}
                      </p>
                    )}

                    {/* Meta */}
                    <div className="mt-auto pt-4 border-t border-border">
                      <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            {article.reads}
                          </span>
                          <span className="flex items-center gap-1">
                            <Heart className="w-3 h-3" />
                            {article.likes}
                          </span>
                        </div>
                        {article.published_at && (
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {formatDate(article.published_at)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
