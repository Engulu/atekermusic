import { useState } from 'react';
import { Play, Download, Heart, ShoppingCart, Share2, X, Facebook, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { Song } from '../types';
import PaymentModal from './PaymentModal';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

interface SongCardProps {
  song: Song;
  showStats?: boolean;
  index?: number;
}

export default function SongCard({ song, showStats = true, index }: SongCardProps) {
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const { addToCart } = useCart();
  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const shareUrl = `https://atekermusic.com/music/${song.id}`;
  const shareText = `🎵 ${song.title}\n` +
    `🎤 By ${song.artistName}\n` +
    `💫 ${song.downloadCount.toLocaleString()} downloads • ${song.playCount.toLocaleString()} plays\n` +
    `${song.isPaid ? `💰 ${song.price.toLocaleString()} UGX\n` : '🎁 Free Download\n'}` +
    `\nDiscover more Teso & Ugandan music on Ateker Music`;

  const shareLinks = {
    whatsapp: `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
    twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    instagram: `instagram://library?AssetPath=${encodeURIComponent(song.coverUrl)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(shareUrl)}`,
    email: `mailto:?subject=${encodeURIComponent(`Check out ${song.title} on Ateker Music`)}&body=${encodeURIComponent(`${shareText}\n\n${shareUrl}`)}`
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: song.title,
          text: shareText,
          url: shareUrl
        });
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          setShowShareMenu(true);
        }
      }
    } else {
      setShowShareMenu(true);
    }
  };

  const handleDownload = async () => {
    if (!song.isPaid) {
      // Free song - direct download
      startDownload();
      return;
    }

    addToCart(song);
  };

  const startDownload = async () => {
    setIsDownloading(true);
    try {
      // TODO: Implement actual download logic
      await new Promise(resolve => setTimeout(resolve, 2000));
      // Simulate download
      const link = document.createElement('a');
      link.href = song.songUrl;
      link.download = `${song.title}.mp3`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Download failed:', error);
    }
    setIsDownloading(false);
  };

  return (
    <>
      <div className="bg-navy-800 rounded-lg overflow-hidden hover:scale-[1.02] transition group relative">
        <Link to={`/music/${song.id}`} className="block">
        {index !== undefined && (
          <div className="absolute top-4 left-4 z-10">
            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white font-bold">
              {index + 1}
            </div>
          </div>
        )}
        
        <img 
          src={song.coverUrl} 
          alt={song.title} 
          className="w-full aspect-square object-cover"
        />
        
        <div className="p-4">
          <h3 className="font-semibold text-lg text-white mb-1">{song.title}</h3>
          <p className="text-gray-400 text-sm mb-4">{song.artistName}</p>
          
          {showStats && (
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-1 text-blue-400 hover:text-blue-300">
                  <Play className="w-4 h-4" />
                  <span>{song.playCount.toLocaleString()}</span>
                </button>
                <button
                  onClick={handleDownload}
                  disabled={isDownloading}
                  className="flex items-center gap-1 text-blue-400 hover:text-blue-300 disabled:opacity-50"
                >
                  <Download className="w-4 h-4" />
                  <span>{song.downloadCount.toLocaleString()}</span>
                </button>
              </div>
              {song.isPaid && (
                <button
                  onClick={handleDownload}
                  className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
                >
                  <ShoppingCart className="w-4 h-4" />
                  <span>Add to Cart</span>
                </button>
              )}
              <div className="flex items-center gap-2">
                {song.isPaid && (
                  <span className="text-yellow-400 font-medium">
                    {song.price.toLocaleString()} UGX
                  </span>
                )}
                <div className="flex items-center gap-4">
                  <button className="flex items-center gap-1 text-red-400 hover:text-red-300">
                    <Heart className="w-4 h-4" />
                    <span>{song.likeCount.toLocaleString()}</span>
                  </button>
                  <div className="relative">
                    <button
                      onClick={handleShare}
                      className="flex items-center gap-1 text-blue-400 hover:text-blue-300"
                    >
                      <Share2 className="w-4 h-4" />
                      <span>Share</span>
                    </button>

                    {showShareMenu && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={() => setShowShareMenu(false)}
                        />
                        <div className="absolute right-0 bottom-full mb-2 w-48 bg-navy-700 rounded-lg shadow-lg overflow-hidden z-20">
                          <a
                            href={shareLinks.whatsapp}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-navy-600"
                          >
                            <img src="/icons/whatsapp.svg" alt="WhatsApp" className="w-5 h-5" />
                            <span>WhatsApp</span>
                          </a>
                          <a
                            href={shareLinks.facebook}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-navy-600"
                          >
                            <Facebook className="w-5 h-5 text-blue-400" />
                            <span>Facebook</span>
                          </a>
                          <a
                            href={shareLinks.twitter}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-navy-600"
                          >
                            <X className="w-5 h-5" />
                            <span>X (Twitter)</span>
                          </a>
                          <a
                            href={shareLinks.instagram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-navy-600"
                          >
                            <Instagram className="w-5 h-5 text-pink-400" />
                            <span>Instagram</span>
                          </a>
                          <a
                            href={shareLinks.telegram}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-navy-600"
                          >
                            <img src="/icons/telegram.svg" alt="Telegram" className="w-5 h-5" />
                            <span>Telegram</span>
                          </a>
                          <a
                            href={shareLinks.linkedin}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-navy-600"
                          >
                            <img src="/icons/linkedin.svg" alt="LinkedIn" className="w-5 h-5" />
                            <span>LinkedIn</span>
                          </a>
                          <a
                            href={shareLinks.email}
                            className="flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-navy-600"
                          >
                            <img src="/icons/email.svg" alt="Email" className="w-5 h-5" />
                            <span>Email</span>
                          </a>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
        </Link>
      </div>

      {showPaymentModal && (
        <PaymentModal
          song={song}
          onClose={() => setShowPaymentModal(false)}
          onSuccess={startDownload}
        />
      )}
    </>
  );
}