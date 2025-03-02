import { useState } from 'react';
import { Clock, Tag, Gift, Zap, Megaphone } from 'lucide-react';
import type { Offer } from '../types';
import { formatDistanceToNow } from 'date-fns';

interface Advertisement {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  link: string;
  company: string;
  startDate: string;
  endDate: string;
}

export default function SpecialOffers() {
  const [activeTab, setActiveTab] = useState<'all' | 'bundles' | 'discounts' | 'flash' | 'ads'>('all');

  const advertisements: Advertisement[] = [
    {
      id: '1',
      title: 'MTN MoMo Pay - The Smart Way to Pay',
      description: 'Send money, pay bills, and shop with ease using MTN Mobile Money. Get exclusive rewards on your transactions.',
      imageUrl: 'https://images.unsplash.com/photo-1556742044-3c52d6e88c62?q=80&w=2070',
      link: 'https://mtn.co.ug/momo/',
      company: 'MTN Uganda',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '2',
      title: 'Enjoy Coca-Cola with Your Favorite Music',
      description: 'Refresh your music experience with an ice-cold Coca-Cola. Special discounts at selected stores.',
      imageUrl: 'https://images.unsplash.com/photo-1554866585-cd94860890b7?q=80&w=2069',
      link: 'https://www.coca-cola.com/ug/en',
      company: 'Coca-Cola Uganda',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: '3',
      title: 'Rock Your Style with Kenzo Fashion',
      description: 'Get 20% off on the latest urban fashion collection. Perfect for music lovers and trend setters.',
      imageUrl: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=2070',
      link: 'https://www.kenzo.com',
      company: 'Kenzo Fashion',
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  const offers: Offer[] = [
    {
      id: '1',
      title: 'Gospel Bundle',
      description: 'Get 5 gospel songs for the price of 3',
      type: 'bundle',
      discount: {
        type: 'percentage',
        value: 40
      },
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=2070',
      conditions: [
        'Valid for gospel genre only',
        'Must purchase minimum 5 songs',
        'Cannot be combined with other offers'
      ],
      appliesTo: {
        type: 'genre',
        value: ['Gospel', 'Teso Gospel']
      }
    },
    {
      id: '2',
      title: 'New User Discount',
      description: 'Get 20% off on your first purchase',
      type: 'discount',
      discount: {
        type: 'percentage',
        value: 20
      },
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      code: 'WELCOME20',
      conditions: [
        'Valid for first purchase only',
        'Minimum purchase of 10,000 UGX required'
      ],
      minimumPurchase: 10000,
      appliesTo: {
        type: 'all'
      }
    },
    {
      id: '3',
      title: 'Flash Sale: Akogo Songs',
      description: 'Get 50% off on all Akogo songs for the next 24 hours',
      type: 'flash',
      discount: {
        type: 'percentage',
        value: 50
      },
      startDate: new Date().toISOString(),
      endDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      imageUrl: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?q=80&w=2070',
      conditions: [
        'Valid for 24 hours only',
        'Applies to Akogo genre songs only'
      ],
      appliesTo: {
        type: 'genre',
        value: ['Akogo', 'Modern Akogo']
      }
    }
  ];

  const filteredOffers = activeTab === 'all' 
    ? offers 
    : offers.filter(offer => {
        switch (activeTab) {
          case 'bundles':
            return offer.type === 'bundle';
          case 'discounts':
            return offer.type === 'discount';
          case 'flash':
            return offer.type === 'flash';
          case 'ads':
            return false;
          default:
            return true;
        }
      });

  return (
    <section className="py-16 bg-navy-900">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-white mb-8">Special Offers</h2>

        {/* Tabs */}
        <div className="flex overflow-x-auto gap-4 mb-8 pb-4">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-6 py-2 rounded-full whitespace-nowrap transition ${
              activeTab === 'all'
                ? 'bg-blue-500 text-white'
                : 'bg-navy-800 text-gray-400 hover:bg-navy-700'
            }`}
          >
            All Offers
          </button>
          <button
            onClick={() => setActiveTab('bundles')}
            className={`flex items-center gap-2 px-6 py-2 rounded-full whitespace-nowrap transition ${
              activeTab === 'bundles'
                ? 'bg-green-500 text-white'
                : 'bg-navy-800 text-gray-400 hover:bg-navy-700'
            }`}
          >
            <Gift className="w-4 h-4" />
            <span>Bundles</span>
          </button>
          <button
            onClick={() => setActiveTab('discounts')}
            className={`flex items-center gap-2 px-6 py-2 rounded-full whitespace-nowrap transition ${
              activeTab === 'discounts'
                ? 'bg-purple-500 text-white'
                : 'bg-navy-800 text-gray-400 hover:bg-navy-700'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Discounts</span>
          </button>
          <button
            onClick={() => setActiveTab('flash')}
            className={`flex items-center gap-2 px-6 py-2 rounded-full whitespace-nowrap transition ${
              activeTab === 'flash'
                ? 'bg-yellow-500 text-white'
                : 'bg-navy-800 text-gray-400 hover:bg-navy-700'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>Flash Sales</span>
          </button>
          <button
            onClick={() => setActiveTab('ads')}
            className={`flex items-center gap-2 px-6 py-2 rounded-full whitespace-nowrap transition ${
              activeTab === 'ads'
                ? 'bg-red-500 text-white'
                : 'bg-navy-800 text-gray-400 hover:bg-navy-700'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>Sponsored</span>
          </button>
        </div>

        {/* Sponsored Ads */}
        {activeTab === 'ads' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {advertisements.map(ad => (
              <a
                key={ad.id}
                href={ad.link}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-navy-800 rounded-lg overflow-hidden hover:scale-[1.02] transition group"
              >
                <div className="relative h-48">
                  <img
                    src={ad.imageUrl}
                    alt={ad.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className="px-3 py-1 rounded-full text-sm font-medium bg-red-500/20 text-red-400">
                      Sponsored
                    </span>
                  </div>
                </div>
                
                <div className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-xl font-semibold text-white">{ad.title}</h3>
                    <Megaphone className="w-5 h-5 text-red-400" />
                  </div>
                  <p className="text-gray-400 mb-4">{ad.description}</p>
                  
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-blue-400 font-medium">{ad.company}</span>
                    <div className="flex items-center gap-2 text-gray-400">
                      <Clock className="w-4 h-4" />
                      <span>
                        {formatDistanceToNow(new Date(ad.endDate), { addSuffix: true })}
                      </span>
                    </div>
                  </div>
                </div>
              </a>
            ))}
          </div>
        )}

        {/* Offers Grid */}
        {activeTab !== 'ads' && <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOffers.map(offer => (
            <div
              key={offer.id}
              className="bg-navy-800 rounded-lg overflow-hidden hover:scale-[1.02] transition"
            >
              {offer.imageUrl && (
                <div className="relative h-48">
                  <img
                    src={offer.imageUrl}
                    alt={offer.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  <div className="absolute bottom-4 left-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      offer.type === 'bundle'
                        ? 'bg-green-500/20 text-green-400'
                        : offer.type === 'flash'
                        ? 'bg-yellow-500/20 text-yellow-400'
                        : 'bg-purple-500/20 text-purple-400'
                    }`}>
                      {offer.type === 'bundle' ? 'Bundle' : offer.type === 'flash' ? 'Flash Sale' : 'Discount'}
                    </span>
                  </div>
                </div>
              )}
              
              <div className="p-6">
                <h3 className="text-xl font-semibold text-white mb-2">{offer.title}</h3>
                <p className="text-gray-400 mb-4">{offer.description}</p>
                
                {/* Discount Badge */}
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-2xl font-bold text-blue-400">
                    {offer.discount.value}
                    {offer.discount.type === 'percentage' ? '%' : ' UGX'}
                  </span>
                  <span className="text-gray-400">off</span>
                </div>

                {/* Time Remaining */}
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                  <Clock className="w-4 h-4" />
                  <span>
                    Ends {formatDistanceToNow(new Date(offer.endDate), { addSuffix: true })}
                  </span>
                </div>

                {/* Conditions */}
                {offer.conditions && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium text-gray-300">Conditions:</h4>
                    <ul className="text-sm text-gray-400 space-y-1">
                      {offer.conditions.map((condition, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <span className="w-1 h-1 bg-gray-400 rounded-full" />
                          {condition}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* Promo Code */}
                {offer.code && (
                  <div className="mt-4 p-3 bg-navy-900 rounded-lg">
                    <p className="text-sm text-gray-400 mb-1">Use code:</p>
                    <p className="font-mono text-lg font-semibold text-blue-400">{offer.code}</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>}
      </div>
    </section>
  );
}