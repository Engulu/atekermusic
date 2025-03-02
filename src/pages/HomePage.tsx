import Hero from '../components/Hero';
import FeaturedSongs from '../components/FeaturedSongs';
import TopSongs from '../components/TopSongs';
import SpecialOffers from '../components/SpecialOffers';
import TopAkogoSongs from '../components/TopAkogoSongs';
import TrendingArtists from '../components/TrendingArtists';
import NewsSection from '../components/NewsSection';

export default function HomePage() {
  return (
    <main>
      <Hero />
      <FeaturedSongs />
      <SpecialOffers />
      <TopSongs />
      <TopAkogoSongs />
      <TrendingArtists />
      <NewsSection />
    </main>
  );
}