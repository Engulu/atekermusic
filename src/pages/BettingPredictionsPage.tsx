import { useState, useEffect } from 'react';
import { Calendar, Trophy, TrendingUp, Star, ChevronDown } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { fetchUpcomingMatches, fetchMatchPrediction } from '../services/sportsApi';
import type { Match, Prediction } from '../services/sportsApi';

interface MatchWithPrediction extends Match {
  prediction?: Prediction;
}

export default function BettingPredictionsPage() {
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [matches, setMatches] = useState<MatchWithPrediction[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMatch, setSelectedMatch] = useState<string | null>(null);

  useEffect(() => {
    const loadMatches = async () => {
      setLoading(true);
      try {
        const fetchedMatches = await fetchUpcomingMatches();
        const matchesWithPredictions = await Promise.all(
          fetchedMatches.map(async (match) => {
            const prediction = await fetchMatchPrediction(match.id);
            return { ...match, prediction };
          })
        );
        setMatches(matchesWithPredictions);
      } catch (error) {
        console.error('Error loading matches:', error);
      }
      setLoading(false);
    };

    loadMatches();
  }, [selectedDate]);

  return (
    <main className="min-h-screen bg-navy-900 pt-24 pb-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Football Predictions</h1>
            <p className="text-gray-400">Expert predictions with high accuracy</p>
          </div>
          
          <div className="flex items-center gap-4">
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-4 py-2 bg-navy-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <div className="bg-navy-800 p-6 rounded-lg">
            <div className="flex items-center gap-4">
              <Trophy className="w-8 h-8 text-yellow-400" />
              <div>
                <p className="text-gray-400">Success Rate</p>
                <p className="text-2xl font-bold text-white">85%</p>
              </div>
            </div>
          </div>
          <div className="bg-navy-800 p-6 rounded-lg">
            <div className="flex items-center gap-4">
              <TrendingUp className="w-8 h-8 text-green-400" />
              <div>
                <p className="text-gray-400">Avg. Odds</p>
                <p className="text-2xl font-bold text-white">1.85</p>
              </div>
            </div>
          </div>
          <div className="bg-navy-800 p-6 rounded-lg">
            <div className="flex items-center gap-4">
              <Calendar className="w-8 h-8 text-blue-400" />
              <div>
                <p className="text-gray-400">Daily Picks</p>
                <p className="text-2xl font-bold text-white">15+</p>
              </div>
            </div>
          </div>
        </div>

        {/* Predictions */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500" />
          </div>
        ) : (
          <div className="space-y-6">
            {matches.map(match => (
            <div key={match.id} className="bg-navy-800 rounded-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <img 
                    src={match.competition.emblem} 
                    alt={match.competition.name}
                    className="w-6 h-6"
                  />
                  <span className="text-blue-400">{match.competition.name}</span>
                </div>
                <div className="flex items-center gap-2 text-gray-400">
                  <Calendar className="w-4 h-4" />
                  <span>{format(parseISO(match.utcDate), 'PPp')}</span>
                </div>
              </div>
              
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4 flex-1">
                  <div className="flex items-center gap-3">
                    <img 
                      src={match.homeTeam.crest} 
                      alt={match.homeTeam.name}
                      className="w-8 h-8"
                    />
                    <span className="text-xl font-semibold text-white">
                      {match.homeTeam.name}
                    </span>
                  </div>
                  <span className="text-gray-400">vs</span>
                  <div className="flex items-center gap-3">
                    <img 
                      src={match.awayTeam.crest} 
                      alt={match.awayTeam.name}
                      className="w-8 h-8"
                    />
                    <span className="text-xl font-semibold text-white">
                      {match.awayTeam.name}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Star className="w-5 h-5 text-yellow-400" />
                  <span className="text-white font-semibold">
                    {match.prediction?.confidence}%
                  </span>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-6">
                <div className="flex items-center gap-4">
                  <span className="px-4 py-2 bg-green-500/10 text-green-400 rounded-lg font-semibold">
                    {match.prediction?.prediction}
                  </span>
                  <span className="text-gray-400">
                    Odds: <span className="text-white font-semibold">
                      {match.prediction?.odds.value}
                    </span>
                  </span>
                </div>
                <button 
                  onClick={() => setSelectedMatch(selectedMatch === match.id ? null : match.id)}
                  className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                >
                  View Analysis
                </button>
              </div>
              
              {selectedMatch === match.id && match.prediction && (
                <div className="mt-6 pt-6 border-t border-gray-700">
                  <h3 className="text-lg font-semibold text-white mb-4">Match Analysis</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="text-blue-400 mb-2">Team Form</h4>
                      <p className="text-gray-400 mb-2">
                        <span className="text-white">Home:</span> {match.prediction.analysis.homeForm}
                      </p>
                      <p className="text-gray-400">
                        <span className="text-white">Away:</span> {match.prediction.analysis.awayForm}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-blue-400 mb-2">Head to Head</h4>
                      <p className="text-gray-400">{match.prediction.analysis.h2h}</p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-blue-400 mb-2">Key Stats</h4>
                    <ul className="list-disc list-inside text-gray-400 space-y-1">
                      {match.prediction.analysis.keyStats.map((stat, index) => (
                        <li key={index}>{stat}</li>
                      ))}
                    </ul>
                  </div>
                  <div className="mt-4">
                    <h4 className="text-blue-400 mb-2">Verdict</h4>
                    <p className="text-gray-400">{match.prediction.analysis.verdict}</p>
                  </div>
                </div>
              )}
            </div>
          ))}
          </div>
        )}
      </div>
    </main>
  );
}